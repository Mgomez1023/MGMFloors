/* Shared behavior for every MGM service detail page. */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function setMenu(open) {
    if (!navToggle || !navLinks) return;

    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));

    const lines = navToggle.querySelectorAll('.hamburger-line');
    if (lines.length === 3) {
      lines[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
      lines[1].style.opacity = open ? '0' : '';
      lines[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
    }
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
  }

  const faqGroups = document.querySelectorAll('[data-service-faq]');

  faqGroups.forEach(function (group) {
    const questions = Array.from(group.querySelectorAll('.service-faq-question'));
    let hasExpandedQuestion = false;

    function setQuestionState(question, expanded) {
      const answerId = question.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      if (!answer) return;

      question.setAttribute('aria-expanded', String(expanded));
      answer.hidden = !expanded;
    }

    questions.forEach(function (question) {
      const shouldExpand = question.getAttribute('aria-expanded') === 'true' && !hasExpandedQuestion;
      if (shouldExpand) hasExpandedQuestion = true;
      setQuestionState(question, shouldExpand);

      question.addEventListener('click', function () {
        const willOpen = question.getAttribute('aria-expanded') !== 'true';

        questions.forEach(function (otherQuestion) {
          setQuestionState(otherQuestion, otherQuestion === question && willOpen);
        });
      });
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      navToggle.focus();
    }
  });
})();
