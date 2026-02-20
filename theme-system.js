(() => {
    const THEMES = {
        'macaron-prince': {
            id: 'macaron-prince',
            label: '馬卡龍奶油王子',
            tokens: {
                '--bg-page': '#FFF9F5',
                '--text-main': '#5E423F',
                '--text-sub': '#8F6E6A',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#FFF0F5',
                '--header-bg-start': '#FFEAF2',
                '--header-bg-mid': '#EEF8FF',
                '--header-bg-end': '#FFF2E6',
                '--header-border': '#F7BFD0',
                '--primary': '#FF8FB3',
                '--primary-hover': '#FF76A0',
                '--accent': '#6ECED6',
                '--accent-hover': '#58C0CB',
                '--gold': '#E7B16B',
                '--gold-hover': '#DAA058',
                '--danger': '#FF7E96',
                '--danger-hover': '#F26A86',
                '--card-net-start': '#FF8FB3',
                '--card-net-mid': '#A98BFF',
                '--card-net-end': '#6ECED6'
            }
        },
        'mint-prince': {
            id: 'mint-prince',
            label: '薄荷巧克力王子',
            tokens: {
                '--bg-page': '#FAF8FF',
                '--text-main': '#2A3F63',
                '--text-sub': '#5873A0',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#EEF5FF',
                '--header-bg-start': '#E9F2FF',
                '--header-bg-mid': '#F7F8FF',
                '--header-bg-end': '#EEF8FF',
                '--header-border': 'rgba(147, 182, 228, 0.34)',
                '--primary': '#547FD1',
                '--primary-hover': '#446FC0',
                '--accent': '#73B6E8',
                '--accent-hover': '#5DA7DE',
                '--gold': '#E7BE6B',
                '--gold-hover': '#D9AC56',
                '--danger': '#D98AAF',
                '--danger-hover': '#CB779D',
                '--card-net-start': '#547FD1',
                '--card-net-mid': '#E7BE6B',
                '--card-net-end': '#73B6E8'
            }
        },
        'lavender-prince': {
            id: 'lavender-prince',
            label: '薰衣草蜂蜜王子',
            tokens: {
                '--bg-page': '#F4FBFF',
                '--text-main': '#2E4D67',
                '--text-sub': '#5A7F9C',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#E8F5FF',
                '--header-bg-start': '#E2F2FF',
                '--header-bg-mid': '#E2FAFF',
                '--header-bg-end': '#EDF6FF',
                '--header-border': '#ADD4F0',
                '--primary': '#46A9E4',
                '--primary-hover': '#359BD8',
                '--accent': '#56CCB4',
                '--accent-hover': '#42C1A8',
                '--gold': '#EAB25E',
                '--gold-hover': '#DC9F47',
                '--danger': '#FF89A6',
                '--danger-hover': '#F67495',
                '--card-net-start': '#46A9E4',
                '--card-net-mid': '#56CCB4',
                '--card-net-end': '#7CCEFF'
            }
        },
        'strawberry-tart-prince': {
            id: 'strawberry-tart-prince',
            label: '草莓塔王子',
            tokens: {
                '--bg-page': '#FFF6F8',
                '--text-main': '#5A2D38',
                '--text-sub': '#8A5866',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#FFEAF1',
                '--header-bg-start': '#FFDDE9',
                '--header-bg-mid': '#FFF1F6',
                '--header-bg-end': '#FFEAF1',
                '--header-border': '#EDA6BC',
                '--primary': '#E24768',
                '--primary-hover': '#D4375A',
                '--accent': '#6FC99B',
                '--accent-hover': '#5ABB8D',
                '--gold': '#EAB15E',
                '--gold-hover': '#DB9D47',
                '--danger': '#EE6B8E',
                '--danger-hover': '#E1587F',
                '--card-net-start': '#E24768',
                '--card-net-mid': '#EAB15E',
                '--card-net-end': '#6FC99B'
            }
        },
        'caramel-pudding-prince': {
            id: 'caramel-pudding-prince',
            label: '焦糖布丁王子',
            tokens: {
                '--bg-page': '#FFF7EC',
                '--text-main': '#5A3E1E',
                '--text-sub': '#8D6640',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#FFEAD1',
                '--header-bg-start': '#FFDEB4',
                '--header-bg-mid': '#FFF4E4',
                '--header-bg-end': '#FFE7CA',
                '--header-border': '#DDAE6B',
                '--primary': '#C3722D',
                '--primary-hover': '#B26220',
                '--accent': '#E3A64F',
                '--accent-hover': '#D4953E',
                '--gold': '#D9A04A',
                '--gold-hover': '#C98F39',
                '--danger': '#D97E5D',
                '--danger-hover': '#CC6E4D',
                '--card-net-start': '#C3722D',
                '--card-net-mid': '#D9A04A',
                '--card-net-end': '#E3A64F'
            }
        },
        'milk-tea-boba-prince': {
            id: 'milk-tea-boba-prince',
            label: '奶茶珍珠王子',
            tokens: {
                '--bg-page': '#FBF6F0',
                '--text-main': '#4D3A2B',
                '--text-sub': '#7C614D',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#F7EBDD',
                '--header-bg-start': '#EEDDC8',
                '--header-bg-mid': '#FAF1E7',
                '--header-bg-end': '#F2E3D2',
                '--header-border': '#D0B392',
                '--primary': '#A86A40',
                '--primary-hover': '#985A34',
                '--accent': '#C09163',
                '--accent-hover': '#B17F53',
                '--gold': '#CEA14F',
                '--gold-hover': '#BE8F40',
                '--danger': '#B77667',
                '--danger-hover': '#A86658',
                '--card-net-start': '#A86A40',
                '--card-net-mid': '#CEA14F',
                '--card-net-end': '#C09163'
            }
        },
        'black-forest-prince': {
            id: 'black-forest-prince',
            label: '黑森林蛋糕王子',
            tokens: {
                '--bg-page': '#F7F2F4',
                '--text-main': '#3C2730',
                '--text-sub': '#6C4F5C',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#F3E3EA',
                '--header-bg-start': '#E8D2DC',
                '--header-bg-mid': '#F6EDF2',
                '--header-bg-end': '#E4CAD5',
                '--header-border': '#BE92A4',
                '--primary': '#64202E',
                '--primary-hover': '#551725',
                '--accent': '#8F4458',
                '--accent-hover': '#803A4D',
                '--gold': '#BD9143',
                '--gold-hover': '#AD812F',
                '--danger': '#822A3E',
                '--danger-hover': '#721F33',
                '--card-net-start': '#64202E',
                '--card-net-mid': '#BD9143',
                '--card-net-end': '#8F4458'
            }
        },
        'coconut-snowball-prince': {
            id: 'coconut-snowball-prince',
            label: '椰子雪球王子',
            tokens: {
                '--bg-page': '#F6FBFF',
                '--text-main': '#304D63',
                '--text-sub': '#66869C',
                '--panel-bg': '#FFFFFF',
                '--panel-soft': '#EAF4FB',
                '--header-bg-start': '#DFEEF8',
                '--header-bg-mid': '#F2F9FF',
                '--header-bg-end': '#DDECF6',
                '--header-border': '#ABCDE2',
                '--primary': '#66A3C2',
                '--primary-hover': '#5494B5',
                '--accent': '#8FD2E4',
                '--accent-hover': '#7DC6DB',
                '--gold': '#D8BC7F',
                '--gold-hover': '#C8AB6B',
                '--danger': '#BC8FA3',
                '--danger-hover': '#AE7F95',
                '--card-net-start': '#66A3C2',
                '--card-net-mid': '#D8BC7F',
                '--card-net-end': '#8FD2E4'
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
