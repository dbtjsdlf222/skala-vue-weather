import { ref } from "vue";
import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  const unit = ref("celsius");
  const darkMode = ref(false);
  const selectedCity = ref("서울");

  // 섭씨와 화씨를 번갈아 변경한다.
  const toggleUnit = () => {
    unit.value = unit.value === "celsius" ? "fahrenheit" : "celsius";
  };

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
  };

  const selectCity = (name) => {
    selectedCity.value = name;
  };

  return {
    unit,
    darkMode,
    selectedCity,
    toggleUnit,
    toggleDarkMode,
    selectCity,
  };
});
