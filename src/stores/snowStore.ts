import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'snow-settings';

interface SnowSettings {
    enabled: boolean;
    count: number;
    speedMin: number;
    speedMax: number;
    sizeMin: number;
    sizeMax: number;
}

const defaultSettings: SnowSettings = {
    enabled: true,
    count: 15,
    speedMin: 11,
    speedMax: 25,
    sizeMin: 1.2,
    sizeMax: 3.0,
};

export const useSnowStore = defineStore('snow', () => {
    // Load from localStorage or use defaults
    const loadFromStorage = (): SnowSettings => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch {
                return defaultSettings;
            }
        }
        return defaultSettings;
    };

    const initial = loadFromStorage();

    // ❄️ Snow Settings
    const enabled = ref(initial.enabled);
    const count = ref(initial.count);
    const speedMin = ref(initial.speedMin);
    const speedMax = ref(initial.speedMax);
    const sizeMin = ref(initial.sizeMin);
    const sizeMax = ref(initial.sizeMax);
    const showPanel = ref(false);

    // Save to localStorage when any setting changes
    const saveToStorage = () => {
        const settings: SnowSettings = {
            enabled: enabled.value,
            count: count.value,
            speedMin: speedMin.value,
            speedMax: speedMax.value,
            sizeMin: sizeMin.value,
            sizeMax: sizeMax.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };

    // Watch all settings
    watch([enabled, count, speedMin, speedMax, sizeMin, sizeMax], saveToStorage);

    const togglePanel = () => {
        showPanel.value = !showPanel.value;
    };

    const reset = () => {
        enabled.value = defaultSettings.enabled;
        count.value = defaultSettings.count;
        speedMin.value = defaultSettings.speedMin;
        speedMax.value = defaultSettings.speedMax;
        sizeMin.value = defaultSettings.sizeMin;
        sizeMax.value = defaultSettings.sizeMax;
    };

    return {
        enabled,
        count,
        speedMin,
        speedMax,
        sizeMin,
        sizeMax,
        showPanel,
        togglePanel,
        reset,
    };
});
