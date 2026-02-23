(() => {
    const THEMES = {
        'macaron-prince': {
            id: 'macaron-prince',
            label: '馬卡龍奶油王子',
            tokens: {
                '--bg-page': '#FFF9F5',
                '--text-main': '#5A4A42',
                '--text-sub': '#8C7A6E',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#FEF5F7',
                '--header-bg-start': '#FEF5F7',
                '--header-bg-mid': '#F2FBFD',
                '--header-bg-end': '#FFF7EC',
                '--header-border': '#FFD1DC',
                '--primary': '#FFB6C1',
                '--primary-hover': '#FF9AB5',
                '--accent': '#A7D8DE',
                '--accent-hover': '#8CCFD6',
                '--gold': '#E8C39E',
                '--gold-hover': '#DDB88E',
                '--danger': '#FFB3BA',
                '--danger-hover': '#FFA5AE',
                '--card-net-start': '#FFB6C1',
                '--card-net-mid': '#C8B6FF',
                '--card-net-end': '#A7D8DE'
            }
        },
        'mint-prince': {
            id: 'mint-prince',
            label: '薄荷巧克力王子',
            tokens: {
                '--bg-page': '#FAF8FF',
                '--text-main': '#2F4366',
                '--text-sub': '#5F7596',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#F6FAFF',
                '--header-bg-start': '#F1F6FF',
                '--header-bg-mid': '#FAF8FF',
                '--header-bg-end': '#F7FBFF',
                '--header-border': 'rgba(173, 201, 235, 0.28)',
                '--primary': '#6E89C8',
                '--primary-hover': '#5E78B6',
                '--accent': '#9EBBEA',
                '--accent-hover': '#8AA9DB',
                '--gold': '#F2D492',
                '--gold-hover': '#E8C39E',
                '--danger': '#E8BFD2',
                '--danger-hover': '#D9AFC3',
                '--card-net-start': '#6E89C8',
                '--card-net-mid': '#F2D492',
                '--card-net-end': '#9EBBEA'
            }
        },
        'lavender-prince': {
            id: 'lavender-prince',
            label: '薰衣草蜂蜜王子',
            tokens: {
                '--bg-page': '#F4FBFF',
                '--text-main': '#355166',
                '--text-sub': '#5F8197',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#ECF7FF',
                '--header-bg-start': '#EAF6FF',
                '--header-bg-mid': '#E8FCFF',
                '--header-bg-end': '#F1F8FF',
                '--header-border': '#BFDFF4',
                '--primary': '#5FB5E8',
                '--primary-hover': '#4CA7DC',
                '--accent': '#7FD5C3',
                '--accent-hover': '#6CCCB8',
                '--gold': '#F1C27D',
                '--gold-hover': '#E6B56E',
                '--danger': '#FFAFC0',
                '--danger-hover': '#F89CAF',
                '--card-net-start': '#5FB5E8',
                '--card-net-mid': '#7FD5C3',
                '--card-net-end': '#9DDCFF'
            }
        }
    };

    const THEME_OPTIONS = Object.values(THEMES).map(theme => ({ value: theme.id, label: theme.label }));

    const applyTheme = (themeId) => {
        const root = document.documentElement;
        const selected = THEMES[themeId] || THEMES['macaron-prince'];
        Object.entries(selected.tokens).forEach(([name, value]) => {
            root.style.setProperty(name, value);
        });
        root.setAttribute('data-theme', selected.id);
        return selected.id;
    };

    window.APP_THEME_SYSTEM = {
        THEMES,
        THEME_OPTIONS,
        applyTheme
    };
})();
