const budgetApp = (() => {
  let ENTRY_LIST = [];
  let balance = 0, income = 0, outcome = 0;
  const DELETE = "delete", EDIT = "edit";
  const DEFAULT_LANGUAGE = "en";
  let currentLanguage = "en";

  const TRANSLATIONS = {
    en: {
      balance: "Balance",
      income: "Income",
      outcome: "Outcome",
      dashboard: "Dashboard",
      expenses: "Expenses",
      all: "All",
      titlePlaceholder: "title",
      amountPlaceholder: "$0",
      addExpense: "Add expense",
      addIncome: "Add income",
      expenseTitleLabel: "Expense title",
      expenseAmountLabel: "Expense amount",
      incomeTitleLabel: "Income title",
      incomeAmountLabel: "Income amount",
    },
    zh: {
      balance: "余额",
      income: "收入",
      outcome: "支出",
      dashboard: "仪表盘",
      expenses: "支出",
      all: "全部",
      titlePlaceholder: "标题",
      amountPlaceholder: "$0",
      addExpense: "添加支出",
      addIncome: "添加收入",
      expenseTitleLabel: "支出标题",
      expenseAmountLabel: "支出金额",
      incomeTitleLabel: "收入标题",
      incomeAmountLabel: "收入金额",
    },
  };

  function loadFromStorage() {
    try {
      const storedData = localStorage.getItem("entry_list");
      ENTRY_LIST = storedData ? JSON.parse(storedData) : [];
      if (!Array.isArray(ENTRY_LIST)) {
        ENTRY_LIST = [];
      }
      return ENTRY_LIST;
    } catch (e) {
      ENTRY_LIST = [];
      return ENTRY_LIST;
    }
  }

  function saveToStorage() {
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
  }

  function validateAmount(amount) {
    const num = Number(amount);
    return isFinite(num) && num > 0;
  }

  function addEntry(type, title, amount) {
    if (!validateAmount(amount)) return false;
    const entry = { type, title, amount: Number(amount) };
    ENTRY_LIST.push(entry);
    return true;
  }

  function deleteEntry(index) {
    if (index >= 0 && index < ENTRY_LIST.length) {
      ENTRY_LIST.splice(index, 1);
      return true;
    }
    return false;
  }

  function calculateTotal(type, list = ENTRY_LIST) {
    let sum = 0;
    list.forEach((entry) => {
      if (entry.type === type) {
        sum += entry.amount;
      }
    });
    return sum;
  }

  function calculateBalance(inc, out) {
    return inc - out;
  }

  function getLanguage() {
    return localStorage.getItem("budget_language") || DEFAULT_LANGUAGE;
  }

  function setLanguage(language) {
    currentLanguage = TRANSLATIONS[language] ? language : DEFAULT_LANGUAGE;
    localStorage.setItem("budget_language", currentLanguage);
    return currentLanguage;
  }

  function getEntryList() {
    return [...ENTRY_LIST];
  }

  function getTranslations() {
    return TRANSLATIONS;
  }

  function resetState() {
    ENTRY_LIST = [];
    balance = 0;
    income = 0;
    outcome = 0;
  }

  function generateEntryHTML(type, title, amount, id) {
    return `<li id="${id}" class="${type}">
              <div class="entry">${title} : $${amount}</div>
              <div id="edit"></div>
              <div id="delete"></div>
            </li>`;
  }

  function formatBalance(income, outcome) {
    const balance = Math.abs(calculateBalance(income, outcome));
    const sign = income >= outcome ? "$" : "-$";
    return { balance, sign, formatted: `<small>${sign}</small>${balance}` };
  }

  function updateLanguageDOM(translatableText, translatablePlaceholders, translatableAriaLabels, languageButtons, language) {
    const lang = setLanguage(language);
    const translations = TRANSLATIONS[lang];

    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    if (translatableText) {
      translatableText.forEach((element) => {
        element.textContent = translations[element.dataset.i18n];
      });
    }
    if (translatablePlaceholders) {
      translatablePlaceholders.forEach((element) => {
        element.placeholder = translations[element.dataset.i18nPlaceholder];
      });
    }
    if (translatableAriaLabels) {
      translatableAriaLabels.forEach((element) => {
        element.setAttribute(
          "aria-label",
          translations[element.dataset.i18nAriaLabel]
        );
      });
    }
    if (languageButtons) {
      languageButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.lang === lang);
      });
    }
    return lang;
  }

  function toggleVisibility(element, elementsToHide, elementToActive, elementsToDeactivate) {
    if (element) element.classList.remove("hide");
    if (elementsToHide) {
      elementsToHide.forEach((el) => {
        if (el) el.classList.add("hide");
      });
    }
    if (elementToActive) elementToActive.classList.add("focus");
    if (elementsToDeactivate) {
      elementsToDeactivate.forEach((el) => {
        if (el) el.classList.remove("focus");
      });
    }
  }

  function clearElements(elements) {
    if (elements) {
      elements.forEach((element) => {
        if (element) element.innerHTML = "";
      });
    }
  }

  function clearInputs(inputs) {
    if (inputs) {
      inputs.forEach((input) => {
        if (input) input.value = "";
      });
    }
  }

  function renderEntries(entryList, expenseList, incomeList, allList) {
    clearElements([expenseList, incomeList, allList].filter(Boolean));

    entryList.forEach((entry, index) => {
      const html = generateEntryHTML(entry.type, entry.title, entry.amount, index);
      if (entry.type === "expense" && expenseList) {
        expenseList.insertAdjacentHTML("afterbegin", html);
      } else if (entry.type === "income" && incomeList) {
        incomeList.insertAdjacentHTML("afterbegin", html);
      }
      if (allList) {
        allList.insertAdjacentHTML("afterbegin", html);
      }
    });
  }

  return {
    loadFromStorage,
    saveToStorage,
    validateAmount,
    addEntry,
    deleteEntry,
    calculateTotal,
    calculateBalance,
    getLanguage,
    setLanguage,
    getEntryList,
    getTranslations,
    resetState,
    ENTRY_LIST,
    generateEntryHTML,
    formatBalance,
    updateLanguageDOM,
    toggleVisibility,
    clearElements,
    clearInputs,
    renderEntries,
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = budgetApp;
}
