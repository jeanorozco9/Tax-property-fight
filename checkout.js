// Pull data from session storage (set by results.js)
const address  = sessionStorage.getItem('tf_address')  || '';
const savings  = parseInt(sessionStorage.getItem('tf_savings'))  || 0;

// Pre-fill address field and order summary
window.addEventListener('DOMContentLoaded', () => {
  if (address) {
    document.getElementById('propertyAddress').value = address;
    document.getElementById('summary-address').textContent = address;
  }
  if (savings) {
    document.getElementById('summary-savings').textContent = '$' + savings.toLocaleString();
  }
});

// Step 2 → Step 3
function goToPayment(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  // Store contact info
  sessionStorage.setItem('tf_firstName', document.getElementById('firstName').value);
  sessionStorage.setItem('tf_lastName',  document.getElementById('lastName').value);
  sessionStorage.setItem('tf_email',     document.getElementById('email').value);

  // Update progress nav
  updateStep(3);

  document.getElementById('step-contact').style.display = 'none';
  document.getElementById('step-payment').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Back to Step 2
function goBack() {
  updateStep(2);
  document.getElementById('step-payment').style.display = 'none';
  document.getElementById('step-contact').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Step 3 → Step 4 (complete order)
function completeOrder(e) {
  e.preventDefault();
  const form = document.getElementById('payment-form');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const btn = document.getElementById('pay-btn');
  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    updateStep(4);
    document.getElementById('step-payment').style.display = 'none';
    document.getElementById('order-summary').style.display = 'none';

    const firstName = sessionStorage.getItem('tf_firstName') || '';
    const lastName  = sessionStorage.getItem('tf_lastName')  || '';
    const email     = sessionStorage.getItem('tf_email')     || '';

    document.getElementById('confirm-address').textContent = address || '—';
    document.getElementById('confirm-name').textContent = `${firstName} ${lastName}`.trim() || '—';
    document.getElementById('confirm-email').textContent = email || '—';
    document.getElementById('confirm-message').textContent =
      `Thanks, ${firstName}! We've received your case and will begin reviewing your property within 24 hours. Check your inbox at ${email} for next steps.`;

    document.getElementById('step-confirm').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1800);
}

// Update the top step indicator
function updateStep(n) {
  const steps = document.querySelectorAll('.checkout-step');
  steps.forEach((el, i) => {
    el.classList.remove('active', 'done');
    const stepNum = i / 2 + 1; // steps are at 0,2,4,6 indices (arrows in between)
    if (!el.classList.contains('checkout-step-arrow')) {
      // handled below
    }
  });

  const stepEls = document.querySelectorAll('.checkout-step:not(.checkout-step-arrow)');
  stepEls.forEach((el, i) => {
    const num = i + 1;
    el.classList.remove('active', 'done');
    if (num < n) el.classList.add('done');
    else if (num === n) el.classList.add('active');
  });
}

// Card number formatting
function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

// Expiry formatting
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 2) val = val.substring(0, 2) + ' / ' + val.substring(2);
  input.value = val;
}
