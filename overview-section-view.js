(() => {
    const OverviewSectionView = ({
        pageText,
        displayCurrency,
        netWorthCardStyle,
        totalAssetsCardStyle,
        totalLiabilitiesCardStyle,
        totals,
        formatAmount,
        toHKD,
        fromHKD,
        monthlySnapshots,
        cashflowEntries,
        cashflowYearData,
        netWorthTier,
        overviewPanelCardStyle,
        assetMix,
        selectedMixCategory,
        setSelectedMixCategory,
        selectedMixItemStyle,
        detailMix,
        detailDonutCenterCardStyle,
        isPrivacyMode,
        togglePrivacyMode,
        tByLang
    }) => {
        const [isAssetTrendModalOpen, setIsAssetTrendModalOpen] = React.useState(false);
        const [selectedTrendPoint, setSelectedTrendPoint] = React.useState(null);
        const [detailYear, setDetailYear] = React.useState(Number(cashflowYearData?.year || new Date().getFullYear()));
        const snapshotRows = Object.entries(monthlySnapshots || {})
            .filter(([key, value]) => /^\d{4}-\d{2}$/.test(key) && value && Number.isFinite(Number(value.assetsHKD)))
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-24)
            .map(([monthKey, value]) => ({
                monthKey,
                assetsDisplay: fromHKD(Number(value.assetsHKD || 0), displayCurrency)
            }));

        const getPreviousMonthKey = (monthKey) => {
            const match = /^(\d{4})-(\d{2})$/.exec(monthKey || '');
            if (!match) return '----';
            const year = Number(match[1]);
            const month = Number(match[2]);
            const previous = new Date(year, month - 2, 1);
            return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}`;
        };

        const chartRows = (() => {
            if (snapshotRows.length === 1) {
                const onlyRow = snapshotRows[0];
                return [
                    { monthKey: getPreviousMonthKey(onlyRow.monthKey), assetsDisplay: 0 },
                    onlyRow
                ];
            }
            if (snapshotRows.length > 1) return snapshotRows;
            return [
                { monthKey: '----', assetsDisplay: 0 },
                { monthKey: '----', assetsDisplay: totals.assets || 0 }
            ];
        })();

        const chartMin = Math.min(...chartRows.map(item => item.assetsDisplay));
        const chartMax = Math.max(...chartRows.map(item => item.assetsDisplay));
        const chartRange = Math.max(1, chartMax - chartMin);
        const chartWidth = 320;
        const chartHeight = 92;
        const formatMonthLabel = (monthKey) => {
            const match = /^(\d{4})-(\d{2})$/.exec(monthKey || '');
            if (!match) return '--';
            return match[2];
        };
        const formatMonthKeyLabel = (monthKey) => {
            const match = /^(\d{4})-(\d{2})$/.exec(monthKey || '');
            if (!match) return '--';
            return `${match[1]}-${match[2]}`;
        };
        const chartPoints = chartRows.map((item, index) => {
            const x = chartRows.length <= 1 ? 0 : (index / (chartRows.length - 1)) * chartWidth;
            const y = chartHeight - (((item.assetsDisplay - chartMin) / chartRange) * chartHeight);
            return { x, y, monthKey: item.monthKey, assetsDisplay: item.assetsDisplay };
        });
        const chartPath = chartPoints.length <= 1
            ? (() => {
                const y = chartPoints[0]?.y ?? (chartHeight / 2);
                return `M 0 ${y.toFixed(2)} L ${chartWidth} ${y.toFixed(2)}`;
            })()
            : chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');

        const modalChartWidth = 900;
        const modalChartHeight = 280;
        const modalChartPoints = chartRows.map((item, index) => {
            const x = chartRows.length <= 1 ? 0 : (index / (chartRows.length - 1)) * modalChartWidth;
            const y = modalChartHeight - (((item.assetsDisplay - chartMin) / chartRange) * modalChartHeight);
            return { x, y, monthKey: item.monthKey, assetsDisplay: item.assetsDisplay };
        });
        const modalChartPath = modalChartPoints.length <= 1
            ? (() => {
                const y = modalChartPoints[0]?.y ?? (modalChartHeight / 2);
                return `M 0 ${y.toFixed(2)} L ${modalChartWidth} ${y.toFixed(2)}`;
            })()
            : modalChartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');

        const firstLabel = formatMonthLabel(chartRows[0]?.monthKey || '');
        const lastLabel = formatMonthLabel(chartRows[chartRows.length - 1]?.monthKey || '');
        React.useEffect(() => {
            const lastRow = chartRows[chartRows.length - 1];
            if (!lastRow) return;
            setSelectedTrendPoint(prev => {
                if (prev?.monthKey === lastRow.monthKey && prev?.assetsDisplay === lastRow.assetsDisplay) {
                    return prev;
                }
                return {
                    monthKey: lastRow.monthKey,
                    assetsDisplay: lastRow.assetsDisplay
                };
            });
        }, [chartRows.length, chartRows[chartRows.length - 1]?.monthKey, chartRows[chartRows.length - 1]?.assetsDisplay]);
        React.useEffect(() => {
            setDetailYear(Number(cashflowYearData?.year || new Date().getFullYear()));
        }, [cashflowYearData?.year]);
        const selectedYear = detailYear;
        const availableYears = React.useMemo(() => {
            const yearSet = new Set([selectedYear, Number(cashflowYearData?.year || selectedYear), new Date().getFullYear()]);
            Object.keys(monthlySnapshots || {}).forEach(key => {
                const match = /^(\d{4})-\d{2}$/.exec(key);
                if (match) yearSet.add(Number(match[1]));
            });
            return Array.from(yearSet).filter(Number.isFinite).sort((a, b) => a - b);
        }, [monthlySnapshots, selectedYear, cashflowYearData?.year]);
        const minDetailYear = availableYears[0] ?? selectedYear;
        const maxDetailYear = availableYears[availableYears.length - 1] ?? selectedYear;
        const detailCashflowYearData = React.useMemo(() => {
            const buildCashflowYearData = window.APP_CASHFLOW_ENGINE?.buildCashflowYearData;
            if (typeof buildCashflowYearData === 'function' && typeof toHKD === 'function' && Array.isArray(cashflowEntries)) {
                return buildCashflowYearData({
                    cashflowEntries,
                    selectedCashflowDate: new Date(selectedYear, 0, 1),
                    displayCurrency,
                    toHKD,
                    fromHKD
                });
            }
            if (Number(cashflowYearData?.year) === selectedYear) return cashflowYearData;
            return {
                year: selectedYear,
                months: Array.from({ length: 12 }).map((_, month) => ({
                    month,
                    label: `${month + 1} 月`,
                    incomeDisplay: 0,
                    expenseDisplay: 0,
                    netDisplay: 0
                }))
            };
        }, [cashflowEntries, cashflowYearData, displayCurrency, fromHKD, selectedYear, toHKD]);
        const cashflowMonths = Array.isArray(detailCashflowYearData?.months) ? detailCashflowYearData.months : [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const visibleMonthLimit = selectedYear < currentYear
            ? 12
            : (selectedYear === currentYear ? currentMonth : 0);

        const monthDetailRows = Array.from({ length: 12 }).map((_, index) => {
            const monthValue = index + 1;
            const monthKey = `${selectedYear}-${String(monthValue).padStart(2, '0')}`;
            const snapshot = monthlySnapshots?.[monthKey];
            const assetValue = snapshot && Number.isFinite(Number(snapshot.assetsHKD))
                ? fromHKD(Number(snapshot.assetsHKD || 0), displayCurrency)
                : null;
            const monthCashflow = cashflowMonths.find(item => Number(item.month) === index) || null;
            return {
                monthLabel: String(monthValue).padStart(2, '0'),
                assets: assetValue,
                income: monthCashflow?.incomeDisplay ?? 0,
                expense: monthCashflow?.expenseDisplay ?? 0,
                net: monthCashflow?.netDisplay ?? 0
            };
        }).filter(row => Number(row.monthLabel) <= visibleMonthLimit);

        return (
        <section className="theme-surface p-4 sm:p-6 rounded-2xl shadow-sm mb-8">
            <div className="theme-text-main font-black mb-4">{pageText.overviewTitle}</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <div className="overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-2">
                        <div className="theme-networth-card p-4 rounded-2xl text-white shadow-lg shrink-0 w-full snap-start min-h-[158px] flex flex-col" style={netWorthCardStyle}>
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="theme-networth-caption text-[10px] font-black uppercase tracking-widest">{pageText.netWorth} ({displayCurrency})</div>
                                <button
                                    type="button"
                                    onClick={togglePrivacyMode}
                                    className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-2 py-1 text-[10px] font-black hover:bg-white/20"
                                    title={isPrivacyMode
                                        ? tByLang('目前為隱藏金額，點擊顯示', 'Amounts are hidden, click to show', '金額は非表示です。クリックして表示')
                                        : tByLang('目前為顯示金額，點擊隱藏', 'Amounts are visible, click to hide', '金額は表示中です。クリックして非表示')}
                                >
                                    <span className="leading-none text-xs" aria-hidden="true">{isPrivacyMode ? '🛡️' : '🗡️'}</span>
                                </button>
                            </div>
                            <div className="text-[28px] font-black tracking-tighter">{formatAmount(totals.netWorth)}</div>
                            <div className="text-xs font-black theme-networth-caption mt-auto pt-1.5">{netWorthTier.emoji} {netWorthTier.label}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAssetTrendModalOpen(true)}
                            className="theme-summary-card border theme-border p-4 rounded-2xl shadow-sm shrink-0 w-full snap-start min-h-[158px] flex flex-col text-left relative"
                        >
                            <div className="theme-text-sub text-[10px] font-black uppercase tracking-widest mb-2">
                                {tByLang('整體資產曲線', 'Total Assets Trend', '総資産トレンド')} ({displayCurrency})
                            </div>
                            {selectedTrendPoint && (
                                <div className="absolute top-3 right-3 rounded-md theme-soft-surface border theme-border px-2 py-1 text-[10px] font-black theme-text-sub text-right">
                                    <div>{formatMonthKeyLabel(selectedTrendPoint.monthKey)}</div>
                                    <div className="theme-text-main">{formatAmount(selectedTrendPoint.assetsDisplay)} {displayCurrency}</div>
                                </div>
                            )}
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 8}`} className="w-full h-20 theme-text-main">
                                <path d={chartPath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                {chartPoints.map((point, index) => (
                                    <circle
                                        key={`${point.monthKey}-${index}`}
                                        cx={point.x}
                                        cy={point.y}
                                        r="2.5"
                                        fill="currentColor"
                                        className="cursor-pointer"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedTrendPoint({ monthKey: point.monthKey, assetsDisplay: point.assetsDisplay });
                                        }}
                                    />
                                ))}
                            </svg>
                            <div className="flex items-center justify-between text-[10px] font-black theme-text-sub mt-auto pt-1">
                                <span>{firstLabel}</span>
                                <span>{lastLabel}</span>
                            </div>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                        <div className="theme-summary-card p-4 rounded-xl" style={totalAssetsCardStyle}>
                            <div className="theme-text-sub text-[10px] font-black uppercase tracking-widest mb-1">{pageText.totalAssets}</div>
                            <div className="text-xl font-black theme-text-main">{formatAmount(totals.assets)}</div>
                        </div>
                        <div className="theme-summary-card p-4 rounded-xl" style={totalLiabilitiesCardStyle}>
                            <div className="theme-text-sub text-[10px] font-black uppercase tracking-widest mb-1">{pageText.totalLiabilities}</div>
                            <div className="text-xl font-black theme-negative">{formatAmount(totals.liabilities)}</div>
                            <div className="text-[10px] font-black theme-text-sub mt-1">{pageText.debtRatio} {totals.debtRatio.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                    <details className="rounded-xl p-3 theme-summary-card" style={overviewPanelCardStyle} open>
                        <summary className="sm:hidden text-xs font-black theme-text-sub cursor-pointer list-none">{pageText.categoryMix}</summary>
                        <div className="space-y-3 mt-3 sm:mt-0">
                            {assetMix.rows.map(item => (
                                <button
                                    type="button"
                                    key={item.categoryKey}
                                    onClick={() => setSelectedMixCategory(item.categoryKey)}
                                    className="w-full text-left rounded-xl p-2 transition-all theme-mix-item"
                                    style={selectedMixCategory === item.categoryKey ? selectedMixItemStyle : undefined}
                                >
                                    <div className="flex justify-between items-center text-xs font-black theme-text-sub">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.hex }}></span>
                                            <span>{item.label}</span>
                                        </span>
                                        <span>{item.ratio.toFixed(1)}% · {formatAmount(item.amount)} {displayCurrency}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </details>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full relative" style={{ background: detailMix.gradient }}>
                                <div className="absolute inset-8 rounded-full flex items-center justify-center theme-summary-card" style={detailDonutCenterCardStyle}>
                                    <div className="text-center">
                                        <div className="text-[10px] theme-text-sub font-black uppercase tracking-widest">{detailMix.categoryLabel}</div>
                                        <div className="text-sm font-black theme-text-main">{pageText.detailMix}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <details className="rounded-xl p-3 theme-summary-card" style={overviewPanelCardStyle} open>
                            <summary className="sm:hidden text-xs font-black theme-text-sub cursor-pointer list-none">{pageText.detailMix}</summary>
                            <div className="space-y-2 mt-3 sm:mt-0">
                                {detailMix.rows.length ? detailMix.rows.map(row => (
                                    <div key={row.label} className="flex items-center justify-between text-xs font-black theme-text-sub">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }}></span>
                                            <span>{row.label}</span>
                                        </div>
                                        <span>{row.ratio.toFixed(1)}% · {formatAmount(row.amount)} {displayCurrency}</span>
                                    </div>
                                )) : (
                                    <p className="text-sm theme-text-sub font-bold text-center">{pageText.noDetailItems}</p>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            {isAssetTrendModalOpen && (
                <div className="fixed inset-0 z-[85] bg-black/45 flex items-center justify-center p-2 sm:p-4" onClick={() => setIsAssetTrendModalOpen(false)}>
                    <div className="theme-surface rounded-2xl shadow-2xl w-[98vw] max-w-5xl h-[92vh] flex flex-col overflow-hidden" onClick={event => event.stopPropagation()}>
                        <div className="px-4 py-3 border-b theme-border flex items-center justify-between gap-3">
                            <div className="text-sm font-black theme-text-main">
                                {tByLang('整體資產曲線（放大）', 'Total Assets Trend (Expanded)', '総資産トレンド（拡大）')}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAssetTrendModalOpen(false)}
                                className="px-3 py-1.5 rounded-lg text-xs font-black theme-tab-inactive"
                            >
                                {tByLang('關閉', 'Close', '閉じる')}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="theme-summary-card border theme-border rounded-xl p-4 relative">
                                {selectedTrendPoint && (
                                    <div className="absolute top-3 right-3 rounded-md theme-soft-surface border theme-border px-2 py-1 text-[11px] font-black theme-text-sub text-right">
                                        <div>{formatMonthKeyLabel(selectedTrendPoint.monthKey)}</div>
                                        <div className="theme-text-main">{formatAmount(selectedTrendPoint.assetsDisplay)} {displayCurrency}</div>
                                    </div>
                                )}
                                <svg viewBox={`0 0 ${modalChartWidth} ${modalChartHeight + 12}`} className="w-full h-56 theme-text-main">
                                    <path d={modalChartPath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    {modalChartPoints.map((point, index) => (
                                        <circle
                                            key={`${point.monthKey}-${index}-modal`}
                                            cx={point.x}
                                            cy={point.y}
                                            r="3"
                                            fill="currentColor"
                                            className="cursor-pointer"
                                            onClick={() => setSelectedTrendPoint({ monthKey: point.monthKey, assetsDisplay: point.assetsDisplay })}
                                        />
                                    ))}
                                </svg>
                                <div className="flex items-center justify-between text-xs font-black theme-text-sub mt-2">
                                    <span>{chartRows[0]?.monthKey || '--'}</span>
                                    <span>{chartRows[chartRows.length - 1]?.monthKey || '--'}</span>
                                </div>
                            </div>

                            <div className="rounded-xl theme-summary-card overflow-hidden">
                                <div className="px-3 py-2 text-xs font-black theme-text-main border-b theme-border flex items-center justify-between gap-2">
                                    <span>{tByLang('年度明細', 'Yearly Details', '年次明細')}（{selectedYear}）</span>
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setDetailYear(prev => Math.max(minDetailYear, prev - 1))}
                                            disabled={selectedYear <= minDetailYear}
                                            className="px-2 py-1 rounded-md theme-tab-inactive disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {tByLang('上年', 'Prev Year', '前年')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDetailYear(currentYear)}
                                            disabled={selectedYear === currentYear}
                                            className="px-2.5 py-1 rounded-md theme-soft-surface border theme-border theme-text-sub font-black leading-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={tByLang('回到今年', 'Jump to current year', '今年に戻る')}
                                        >
                                            {selectedYear}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDetailYear(prev => Math.min(maxDetailYear, prev + 1))}
                                            disabled={selectedYear >= maxDetailYear}
                                            className="px-2 py-1 rounded-md theme-tab-inactive disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {tByLang('下年', 'Next Year', '次年')}
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="theme-soft-surface text-left">
                                                <th className="px-3 py-2 font-black theme-text-sub">{tByLang('月份', 'Month', '月')}</th>
                                                <th className="px-3 py-2 font-black theme-text-sub">{tByLang('總資產', 'Total Assets', '総資産')}</th>
                                                <th className="px-3 py-2 font-black theme-text-sub">{tByLang('每月收入', 'Monthly Income', '月間収入')}</th>
                                                <th className="px-3 py-2 font-black theme-text-sub">{tByLang('每月支出', 'Monthly Expense', '月間支出')}</th>
                                                <th className="px-3 py-2 font-black theme-text-sub">{tByLang('每月淨流', 'Monthly Net Flow', '月間純フロー')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!monthDetailRows.length && (
                                                <tr className="border-t theme-border">
                                                    <td className="px-3 py-4 text-center font-black theme-text-sub" colSpan={5}>
                                                        {tByLang('目前年份尚未開始，暫無可顯示月份。', 'Selected year has not started yet.', '選択した年はまだ開始していません。')}
                                                    </td>
                                                </tr>
                                            )}
                                            {monthDetailRows.map(row => (
                                                <tr key={`overview-month-${row.monthLabel}`} className="border-t theme-border">
                                                    <td className="px-3 py-2 font-black theme-text-main">{row.monthLabel}</td>
                                                    <td className="px-3 py-2 font-bold theme-text-main">{row.assets === null ? '--' : `${formatAmount(row.assets)} ${displayCurrency}`}</td>
                                                    <td className="px-3 py-2 font-bold text-emerald-600">+{formatAmount(row.income)} {displayCurrency}</td>
                                                    <td className="px-3 py-2 font-bold text-rose-600">-{formatAmount(row.expense)} {displayCurrency}</td>
                                                    <td className={`px-3 py-2 font-bold ${row.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.net >= 0 ? '+' : ''}{formatAmount(row.net)} {displayCurrency}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
    };

    window.APP_OVERVIEW_SECTION_VIEW = {
        OverviewSectionView
    };
})();
