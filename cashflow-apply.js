(() => {
    const { ONE_DAY_MS } = window.APP_CONSTANTS || {};
    const {
        toDateKey,
        parseDateKey,
        isEntryOnDate
    } = window.APP_UTILS || {};

    if (!ONE_DAY_MS || !toDateKey || !parseDateKey || !isEntryOnDate) {
        throw new Error('constants.js or utils.js is missing or incomplete for cashflow-apply.js');
    }

    const applyAutoCashflowPostings = ({
        assets,
        cashflowEntries,
        cashflowAppliedOccurrenceKeys,
        cashflowAppliedPostings,
        cashflowLastAutoApplyDate,
        toHKD,
        fromHKD
    }) => {
        const todayKey = toDateKey(new Date());
        const lastAppliedDate = parseDateKey(cashflowLastAutoApplyDate) || new Date(Date.now() - ONE_DAY_MS);
        const todayDate = parseDateKey(todayKey);
        if (!todayDate) return null;

        const targetEntries = cashflowEntries.filter(entry => {
            if (entry.type === 'TRANSFER') {
                return entry.sourceLiquidAssetId && entry.targetLiquidAssetId;
            }
            return entry.targetLiquidAssetId;
        });
        if (!targetEntries.length) {
            return {
                updated: false,
                appliedCount: 0,
                todayKey,
                nextAssets: assets,
                nextAppliedOccurrenceKeys: cashflowAppliedOccurrenceKeys,
                nextAppliedPostings: cashflowAppliedPostings
            };
        }

        const liquidAssetIndexMap = {};
        assets.forEach((asset, index) => {
            if (asset.category === 'LIQUID') liquidAssetIndexMap[asset.id] = index;
        });

        const appliedKeySet = new Set(cashflowAppliedOccurrenceKeys);
        const appliedPostingKeySet = new Set(Object.keys(cashflowAppliedPostings));
        const nextAppliedPostings = { ...cashflowAppliedPostings };
        const nextAssets = [...assets];
        let updated = false;
        let appliedCount = 0;

        const shouldReplayFromTomorrow = lastAppliedDate.getTime() < todayDate.getTime();
        const cursor = shouldReplayFromTomorrow
            ? new Date(lastAppliedDate.getFullYear(), lastAppliedDate.getMonth(), lastAppliedDate.getDate() + 1)
            : new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

        while (cursor.getTime() <= todayDate.getTime()) {
            const currentDate = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
            const dateKey = toDateKey(currentDate);

            targetEntries.forEach(entry => {
                if (!isEntryOnDate(entry, currentDate)) return;

                if (entry.type === 'TRANSFER') {
                    const sourceIndex = liquidAssetIndexMap[entry.sourceLiquidAssetId];
                    const targetIndex = liquidAssetIndexMap[entry.targetLiquidAssetId];
                    if (!Number.isInteger(sourceIndex) || !Number.isInteger(targetIndex)) return;
                    if (entry.sourceLiquidAssetId === entry.targetLiquidAssetId) return;

                    const sourceAsset = nextAssets[sourceIndex];
                    const targetAsset = nextAssets[targetIndex];
                    if (!sourceAsset || sourceAsset.category !== 'LIQUID' || !targetAsset || targetAsset.category !== 'LIQUID') return;

                    const occurrenceOutKey = `${entry.id}@${dateKey}@OUT@${entry.sourceLiquidAssetId}`;
                    const occurrenceInKey = `${entry.id}@${dateKey}@IN@${entry.targetLiquidAssetId}`;
                    if (appliedKeySet.has(occurrenceOutKey) || appliedPostingKeySet.has(occurrenceOutKey) || appliedKeySet.has(occurrenceInKey) || appliedPostingKeySet.has(occurrenceInKey)) return;

                    const amountHKD = toHKD(entry.amount, entry.currency || sourceAsset.currency);
                    const sourceAmount = fromHKD(amountHKD, sourceAsset.currency);
                    const targetAmount = fromHKD(amountHKD, targetAsset.currency);

                    const nextSourceQuantity = Number(sourceAsset.quantity || 0) - sourceAmount;
                    const nextTargetQuantity = Number(targetAsset.quantity || 0) + targetAmount;

                    nextAssets[sourceIndex] = {
                        ...sourceAsset,
                        quantity: Number(nextSourceQuantity.toFixed(6))
                    };
                    nextAssets[targetIndex] = {
                        ...targetAsset,
                        quantity: Number(nextTargetQuantity.toFixed(6))
                    };

                    appliedKeySet.add(occurrenceOutKey);
                    appliedKeySet.add(occurrenceInKey);
                    nextAppliedPostings[occurrenceOutKey] = {
                        entryId: entry.id,
                        targetLiquidAssetId: entry.sourceLiquidAssetId,
                        signedAmount: Number((-sourceAmount).toFixed(6)),
                        targetCurrency: sourceAsset.currency,
                        type: entry.type,
                        transferRole: 'OUT'
                    };
                    nextAppliedPostings[occurrenceInKey] = {
                        entryId: entry.id,
                        targetLiquidAssetId: entry.targetLiquidAssetId,
                        signedAmount: Number(targetAmount.toFixed(6)),
                        targetCurrency: targetAsset.currency,
                        type: entry.type,
                        transferRole: 'IN'
                    };
                    appliedCount += 1;
                    updated = true;
                    return;
                }

                const targetIndex = liquidAssetIndexMap[entry.targetLiquidAssetId];
                if (!Number.isInteger(targetIndex)) return;

                const occurrenceKey = `${entry.id}@${dateKey}@${entry.targetLiquidAssetId}`;
                if (appliedKeySet.has(occurrenceKey) || appliedPostingKeySet.has(occurrenceKey)) return;

                const targetAsset = nextAssets[targetIndex];
                if (!targetAsset || targetAsset.category !== 'LIQUID') return;

                const amountHKD = toHKD(entry.amount, entry.currency);
                const amountInTargetCurrency = fromHKD(amountHKD, targetAsset.currency);
                const signedAmount = entry.type === 'INCOME' ? amountInTargetCurrency : -amountInTargetCurrency;
                const nextQuantity = Number(targetAsset.quantity || 0) + signedAmount;

                nextAssets[targetIndex] = {
                    ...targetAsset,
                    quantity: Number(nextQuantity.toFixed(6))
                };

                appliedKeySet.add(occurrenceKey);
                nextAppliedPostings[occurrenceKey] = {
                    entryId: entry.id,
                    targetLiquidAssetId: entry.targetLiquidAssetId,
                    signedAmount: Number(signedAmount.toFixed(6)),
                    targetCurrency: targetAsset.currency,
                    type: entry.type
                };
                appliedCount += 1;
                updated = true;
            });

            cursor.setDate(cursor.getDate() + 1);
        }

        return {
            updated,
            appliedCount,
            todayKey,
            nextAssets,
            nextAppliedOccurrenceKeys: Array.from(appliedKeySet),
            nextAppliedPostings
        };
    };

    window.APP_CASHFLOW_APPLY = {
        applyAutoCashflowPostings
    };
})();
