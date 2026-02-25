(() => {
    const FinanceSectionView = ({
        financeSectionTab,
        setFinanceSectionTab,
        pageText,
        selectedStatsCategory,
        setSelectedStatsCategory,
        setSelectedStatsAccount,
        setSelectedStatsSegmentKey,
        CATEGORY_KEYS,
        translate,
        CATEGORIES,
        statsBreakdownMode,
        setStatsBreakdownMode,
        accountStats,
        tByLang,
        accountChartCenterStyle,
        describeArc,
        selectedMixItemStyle,
        overviewPanelCardStyle,
        formatAmount,
        displayCurrency,
        MonthPicker,
        selectedCashflowMonth,
        setSelectedCashflowMonth,
        toMonthKey,
        pageLanguage,
        moveCashflowMonth,
        CashflowOverviewView,
        cashflowMonthData,
        cashflowYearData,
        cashflowView,
        setCashflowView,
        WEEKDAY_LABELS,
        CashflowRulesView,
        cashflowEntries,
        filteredCashflowEntries,
        cashflowRuleKeyword,
        setCashflowRuleKeyword,
        cashflowRuleFilter,
        setCashflowRuleFilter,
        cashflowRuleSortMode,
        setCashflowRuleSortMode,
        editingCashflowId,
        cancelCashflowEdit,
        setCashflowRulesVisibleCount,
        cashflowRulesVisibleCount,
        CASHFLOW_TYPES,
        CASHFLOW_FREQUENCIES,
        liquidAssetLabelById,
        liquidAssetMetaById,
        cashflowTriggerInfoById,
        fromHKD,
        toHKD,
        startNewAssetEntry,
        startNewCashflowEntry,
        startEditCashflowEntry,
        handleDeleteCashflowEntry,
        openEdit,
        AssetDetailListView,
        categoryMixHexByKey,
        groupedAssets,
        cashflowAutoRulesByLiquidAssetId,
        insuranceAutoPaidCountByAssetId,
        insurancePartialWithdrawalStatsByAssetId,
        onInsuranceFundRowFieldChange,
        onInsuranceFundAppendRowWithData,
        onInsuranceFundRemoveRow,
        onInsuranceFundMoveRow,
        onInsuranceFundDuplicateRow,
        onInsuranceFundClearRows,
        fundCurrencyOptions,
        chartPalette,
        fundAccentColor
    }) => {
        const [isSelectedItemModalOpen, setIsSelectedItemModalOpen] = React.useState(false);
        const selectedMembers = accountStats?.selectedItem?.members || [];

        const quickDetailGroupedAssets = React.useMemo(() => {
            if (!accountStats?.selectedItem || !selectedMembers.length) return [];

            const accountMap = {};
            selectedMembers.forEach(item => {
                const accountName = item?.account || tByLang('未分類帳戶', 'Uncategorized Account', '未分類口座');
                if (!accountMap[accountName]) accountMap[accountName] = [];
                accountMap[accountName].push(item);
            });

            const accounts = Object.entries(accountMap)
                .sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'zh-Hant', { numeric: true, sensitivity: 'base' }))
                .map(([accountName, items]) => ({ accountName, items }));

            return [{
                categoryKey: selectedStatsCategory,
                accounts
            }];
        }, [accountStats?.selectedItem, selectedMembers, selectedStatsCategory, tByLang]);

        const quickExpandedAccounts = React.useMemo(() => {
            const expanded = {};
            quickDetailGroupedAssets.forEach(group => {
                (group.accounts || []).forEach(account => {
                    expanded[`${group.categoryKey}::${account.accountName}`] = true;
                });
            });
            return expanded;
        }, [quickDetailGroupedAssets]);

        const handleQuickEditAsset = (asset) => {
            if (!asset || typeof openEdit !== 'function') return;
            openEdit(asset);
        };

        const handleEditSelectedItem = () => {
            const targetAsset = selectedMembers[0];
            if (!targetAsset) return;
            handleQuickEditAsset(targetAsset);
        };

        const hasQuickDetailList = quickDetailGroupedAssets.length > 0;

        React.useEffect(() => {
            if (!isSelectedItemModalOpen) return;
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }, [isSelectedItemModalOpen]);

        return (
        <>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setFinanceSectionTab('ASSET_ACCOUNT')}
                    className={`px-4 py-2 rounded-lg text-sm font-black ${financeSectionTab === 'ASSET_ACCOUNT' ? 'theme-tab-active' : 'theme-tab-inactive'}`}
                >
                    {pageText.tabAssetAccount}
                </button>
                <button
                    type="button"
                    onClick={() => setFinanceSectionTab('CASHFLOW')}
                    className={`px-4 py-2 rounded-lg text-sm font-black ${financeSectionTab === 'CASHFLOW' ? 'theme-tab-active' : 'theme-tab-inactive'}`}
                >
                    {pageText.tabCashflow}
                </button>
            </div>

            {financeSectionTab === 'ASSET_ACCOUNT' && (
                <section className="theme-surface p-4 sm:p-6 rounded-2xl shadow-sm mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="theme-text-main font-black">{pageText.tabAssetAccount}</div>
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                            <select
                                value={selectedStatsCategory}
                                onChange={e => {
                                    setSelectedStatsCategory(e.target.value);
                                    setSelectedStatsAccount('');
                                    setSelectedStatsSegmentKey('');
                                }}
                                className="theme-input rounded-lg px-3 py-2 font-bold text-sm shadow-sm outline-none w-full sm:w-auto"
                            >
                                {CATEGORY_KEYS.map(categoryKey => <option key={categoryKey} value={categoryKey}>{translate(CATEGORIES[categoryKey].label)}</option>)}
                            </select>
                            <select
                                value={statsBreakdownMode}
                                onChange={e => {
                                    setStatsBreakdownMode(e.target.value);
                                    setSelectedStatsSegmentKey('');
                                }}
                                className="theme-input rounded-lg px-3 py-2 font-bold text-sm shadow-sm outline-none w-full sm:w-auto"
                            >
                                <option value="ACCOUNT">{tByLang('按帳戶佔比', 'By Account Share', '口座別比率')}</option>
                                <option value="ITEM">{tByLang('按帳戶內細項', 'By Account Item Share', '口座内項目別比率')}</option>
                            </select>
                            {statsBreakdownMode === 'ITEM' && (
                                <select
                                    value={accountStats.currentAccount}
                                    onChange={e => {
                                        setSelectedStatsAccount(e.target.value);
                                        setSelectedStatsSegmentKey('');
                                    }}
                                    className="theme-input rounded-lg px-3 py-2 font-bold text-sm shadow-sm outline-none w-full sm:w-auto"
                                >
                                    {accountStats.accountNames.length ? (
                                        accountStats.accountNames.map(account => <option key={account} value={account}>{account}</option>)
                                    ) : (
                                        <option value="">{tByLang('尚無帳戶', 'No accounts yet', '口座がありません')}</option>
                                    )}
                                </select>
                            )}
                            <button
                                type="button"
                                onClick={startNewAssetEntry}
                                className="inline-flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-black theme-tab-active w-full sm:w-auto whitespace-nowrap"
                            >
                                {tByLang('新增資產', 'Add Asset', '資産を追加')}
                            </button>
                        </div>
                    </div>

                    {!accountStats.accountNames.length ? (
                        <p className="text-sm theme-text-sub font-bold">{tByLang('目前此類別沒有可統計資料', 'No data for this category yet', 'このカテゴリに集計データがありません')}</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="flex justify-center">
                                <svg viewBox="0 0 260 260" className="w-48 h-48 sm:w-56 sm:h-56">
                                    {accountStats.segments.length === 1 ? (
                                        <circle
                                            cx="130"
                                            cy="130"
                                            r="110"
                                            fill={accountStats.segments[0].color}
                                            stroke={accountChartCenterStyle.ringStroke}
                                            strokeWidth="2"
                                            className="cursor-pointer"
                                            onClick={() => setSelectedStatsSegmentKey(accountStats.segments[0].key)}
                                        />
                                    ) : (
                                        accountStats.segments.map(segment => (
                                            <path
                                                key={segment.key}
                                                d={describeArc(130, 130, 110, segment.startAngle, segment.endAngle)}
                                                fill={segment.color}
                                                stroke={accountChartCenterStyle.ringStroke}
                                                strokeWidth="2"
                                                className="cursor-pointer"
                                                opacity={accountStats.selectedItem?.key === segment.key ? 1 : 0.8}
                                                onClick={() => setSelectedStatsSegmentKey(segment.key)}
                                            />
                                        ))
                                    )}
                                    <circle cx="130" cy="130" r="62" fill={accountChartCenterStyle.holeFill} />
                                    <text x="130" y="116" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 800, fill: accountChartCenterStyle.labelFill }}>
                                        {accountStats.selectedItem ? accountStats.selectedItem.label : (statsBreakdownMode === 'ACCOUNT' ? translate(CATEGORIES[selectedStatsCategory].label) : accountStats.currentAccount)}
                                    </text>
                                    <text x="130" y="136" textAnchor="middle" style={{ fontSize: '13px', fontWeight: 900, fill: accountChartCenterStyle.valueFill }}>
                                        {accountStats.selectedItem ? `${formatAmount(accountStats.selectedItem.valueDisplay)} ${displayCurrency}` : `${formatAmount(accountStats.total)} ${displayCurrency}`}
                                    </text>
                                    <text x="130" y="154" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 800, fill: accountChartCenterStyle.hintFill }}>
                                        {accountStats.selectedItem ? `${accountStats.selectedItem.ratio.toFixed(1)}%` : tByLang('點擊區塊查看佔比', 'Click a segment to view ratio', 'セグメントをクリックして比率を表示')}
                                    </text>
                                </svg>
                            </div>

                            <div className="lg:col-span-2 space-y-3">
                                <div className="space-y-2">
                                    {accountStats.segments.map(segment => (
                                        <button
                                            key={segment.key}
                                            type="button"
                                            onClick={() => setSelectedStatsSegmentKey(segment.key)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${accountStats.selectedItem?.key === segment.key ? 'theme-mix-item' : 'theme-surface theme-mix-item'}`}
                                            style={accountStats.selectedItem?.key === segment.key ? selectedMixItemStyle : undefined}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }}></span>
                                                <span className="text-sm font-bold theme-text-main truncate">{segment.label}</span>
                                                <span className="text-[10px] theme-text-sub font-black">{segment.symbol ? `(${segment.symbol})` : ''}</span>
                                            </div>
                                            <div className="text-xs font-black theme-text-sub whitespace-nowrap text-right">
                                                <div>{formatAmount(segment.valueDisplay)} {displayCurrency}</div>
                                                <div>{segment.ratio.toFixed(1)}%</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {accountStats.selectedItem && (
                                    <details className="rounded-xl p-4 theme-summary-card" style={overviewPanelCardStyle} open>
                                        <summary className="md:hidden text-xs theme-text-sub font-black cursor-pointer list-none">{tByLang('已選擇項目細節', 'Selected Item Details', '選択中の項目詳細')}</summary>
                                        <div className="mt-3 md:mt-0">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="text-xs theme-text-sub font-black">{tByLang('已選擇項目', 'Selected Item', '選択中の項目')}</div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSelectedItemModalOpen(true)}
                                                        className="px-2.5 py-1 rounded-lg text-[11px] font-black theme-tab-inactive"
                                                    >
                                                        {tByLang('查看/修改', 'View/Edit', '表示/編集')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleEditSelectedItem}
                                                        disabled={!selectedMembers.length}
                                                        className="px-2.5 py-1 rounded-lg text-[11px] font-black theme-tab-active disabled:opacity-50"
                                                    >
                                                        {tByLang('修改', 'Edit', '編集')}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-base font-black theme-text-main mb-1">{accountStats.selectedItem.label}</div>
                                            <div className="text-xs theme-text-sub font-bold mb-2">
                                                {statsBreakdownMode === 'ACCOUNT'
                                                    ? tByLang(
                                                        `帳戶資產項目：${accountStats.selectedItem.members?.length || 0} 筆`,
                                                        `Account Asset Items: ${accountStats.selectedItem.members?.length || 0}`,
                                                        `口座資産項目：${accountStats.selectedItem.members?.length || 0}件`
                                                    )
                                                    : (accountStats.selectedItem.subtype || translate(CATEGORIES[selectedStatsCategory].label))}
                                                {accountStats.selectedItem.symbol ? ` · ${accountStats.selectedItem.symbol}` : ''}
                                            </div>
                                            <div className="text-sm font-bold theme-text-main">{tByLang('名稱：', 'Name:', '名称：')}{accountStats.selectedItem.label}</div>
                                            <div className="text-sm font-bold theme-text-main">{tByLang('金額：', 'Amount:', '金額：')}{formatAmount(accountStats.selectedItem.valueDisplay)} {displayCurrency}</div>
                                            <div className="text-sm font-bold theme-text-main">{tByLang('百分比：', 'Ratio:', '比率：')}{accountStats.selectedItem.ratio.toFixed(2)}%</div>
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {financeSectionTab === 'CASHFLOW' && (
                <section className="theme-surface p-4 sm:p-6 rounded-2xl shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                        <div>
                            <div className="text-slate-800 font-black">{pageText.tabCashflow}</div>
                            <p className="text-xs text-slate-400 font-bold mt-1">{pageText.cashflowDesc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => moveCashflowMonth(-1)}
                                className="px-3 py-2 rounded-lg text-xs font-black theme-tab-inactive"
                            >
                                {pageText.prevMonth}
                            </button>
                            <MonthPicker
                                value={selectedCashflowMonth}
                                onChange={e => setSelectedCashflowMonth(e.target.value || toMonthKey(new Date()))}
                                className="px-3 py-2 rounded-lg text-xs font-black theme-input outline-none"
                                pageLanguage={pageLanguage}
                            />
                            <button
                                type="button"
                                onClick={() => moveCashflowMonth(1)}
                                className="px-3 py-2 rounded-lg text-xs font-black theme-tab-inactive"
                            >
                                {pageText.nextMonth}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <CashflowOverviewView
                            cashflowMonthData={cashflowMonthData}
                            cashflowYearData={cashflowYearData}
                            displayCurrency={displayCurrency}
                            formatAmount={formatAmount}
                            cashflowView={cashflowView}
                            setCashflowView={setCashflowView}
                            WEEKDAY_LABELS={WEEKDAY_LABELS}
                            pageLanguage={pageLanguage}
                        />

                        <CashflowRulesView
                            cashflowEntries={cashflowEntries}
                            filteredCashflowEntries={filteredCashflowEntries}
                            cashflowRuleKeyword={cashflowRuleKeyword}
                            setCashflowRuleKeyword={setCashflowRuleKeyword}
                            cashflowRuleFilter={cashflowRuleFilter}
                            setCashflowRuleFilter={setCashflowRuleFilter}
                            cashflowRuleSortMode={cashflowRuleSortMode}
                            setCashflowRuleSortMode={setCashflowRuleSortMode}
                            editingCashflowId={editingCashflowId}
                            cancelCashflowEdit={cancelCashflowEdit}
                            setCashflowRulesVisibleCount={setCashflowRulesVisibleCount}
                            cashflowRulesVisibleCount={cashflowRulesVisibleCount}
                            CASHFLOW_TYPES={CASHFLOW_TYPES}
                            CASHFLOW_FREQUENCIES={CASHFLOW_FREQUENCIES}
                            liquidAssetLabelById={liquidAssetLabelById}
                            liquidAssetMetaById={liquidAssetMetaById}
                            cashflowTriggerInfoById={cashflowTriggerInfoById}
                            formatAmount={formatAmount}
                            fromHKD={fromHKD}
                            toHKD={toHKD}
                            displayCurrency={displayCurrency}
                            pageLanguage={pageLanguage}
                            startNewCashflowEntry={startNewCashflowEntry}
                            startEditCashflowEntry={startEditCashflowEntry}
                            handleDeleteCashflowEntry={handleDeleteCashflowEntry}
                        />
                    </div>
                </section>
            )}

            {isSelectedItemModalOpen && (
                <div className="fixed inset-0 z-40 bg-black/45 flex items-center justify-center p-2 sm:p-4">
                    <div className="theme-surface rounded-2xl shadow-2xl w-[98vw] h-[94vh] flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b theme-border flex items-center justify-between gap-3">
                            <div>
                                <div className="text-sm font-black theme-text-main">{tByLang('已選擇項目快速查看/修改', 'Quick View/Edit Selected Item', '選択中項目のクイック表示/編集')}</div>
                                <div className="text-xs theme-text-sub font-bold">{accountStats?.selectedItem?.label || '-'}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSelectedItemModalOpen(false)}
                                className="px-3 py-1.5 rounded-lg text-xs font-black theme-tab-inactive"
                            >
                                {tByLang('關閉', 'Close', '閉じる')}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                            {hasQuickDetailList && AssetDetailListView ? (
                                <AssetDetailListView
                                    groupedAssets={quickDetailGroupedAssets}
                                    categoryMixHexByKey={categoryMixHexByKey}
                                    translate={translate}
                                    CATEGORIES={CATEGORIES}
                                    toHKD={toHKD}
                                    fromHKD={fromHKD}
                                    displayCurrency={displayCurrency}
                                    expandedAccounts={quickExpandedAccounts}
                                    toggleAccountExpand={() => {}}
                                    formatAmount={formatAmount}
                                    openEdit={openEdit}
                                    tByLang={tByLang}
                                    cashflowAutoRulesByLiquidAssetId={cashflowAutoRulesByLiquidAssetId}
                                    insuranceAutoPaidCountByAssetId={insuranceAutoPaidCountByAssetId}
                                    insurancePartialWithdrawalStatsByAssetId={insurancePartialWithdrawalStatsByAssetId}
                                    CASHFLOW_FREQUENCIES={CASHFLOW_FREQUENCIES}
                                    onInsuranceFundRowFieldChange={onInsuranceFundRowFieldChange}
                                    onInsuranceFundAppendRowWithData={onInsuranceFundAppendRowWithData}
                                    onInsuranceFundRemoveRow={onInsuranceFundRemoveRow}
                                    onInsuranceFundMoveRow={onInsuranceFundMoveRow}
                                    onInsuranceFundDuplicateRow={onInsuranceFundDuplicateRow}
                                    onInsuranceFundClearRows={onInsuranceFundClearRows}
                                    fundCurrencyOptions={fundCurrencyOptions}
                                    chartPalette={chartPalette}
                                    fundAccentColor={fundAccentColor}
                                    liquidAssetLabelById={liquidAssetLabelById}
                                />
                            ) : (
                                <div className="text-sm font-bold theme-text-sub">{tByLang('目前沒有可查看的項目。', 'No items available for quick view.', 'クイック表示できる項目がありません。')}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
    };

    window.APP_FINANCE_SECTION_VIEW = {
        FinanceSectionView
    };
})();
