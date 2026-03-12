// Route to results page
function goToResults(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="text"]');
  const address = input?.value.trim();
  if (!address) { input?.focus(); return; }
  window.location.href = 'results.html?address=' + encodeURIComponent(address);
}

// FAQ Toggle
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => { i.textContent = '+'; i.style.transform = 'rotate(0deg)'; });

  if (!isOpen) {
    answer.classList.add('open');
    icon.textContent = '×';
    icon.style.transform = 'rotate(0deg)';
  }
}

// Signup form
function handleSignup(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  const address = inputs[0]?.value.trim();

  if (!address) {
    inputs[0].focus();
    inputs[0].style.borderColor = '#ef4444';
    setTimeout(() => { inputs[0].style.borderColor = ''; }, 2000);
    return;
  }

  const btn = e.target.querySelector('button');
  btn.textContent = 'Analyzing your property...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "We'll be in touch!";
    btn.style.background = '#2d8f6f';
    btn.style.color = '#fff';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = btn.dataset.originalText || 'Check My Savings';
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }, 1500);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});
