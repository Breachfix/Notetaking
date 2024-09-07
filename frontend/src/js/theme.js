'use strict';

/**
 * Toggles the theme between 'light' and 'dark' modes.
 * Updates the DOM and stores the preference in localStorage.
 */
const toggleTheme = function () {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/**
 * Initialize the theme based on stored preference or system settings.
 */
const storedTheme = localStorage.getItem('theme');
const systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme ?? (systemThemeIsDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

/**
 * Attach the theme toggle function to the theme button.
 */
window.addEventListener('DOMContentLoaded', function () {
  const $themeBtn = document.querySelector('[data-theme-btn]');
  if ($themeBtn) $themeBtn.addEventListener('click', toggleTheme);
});
