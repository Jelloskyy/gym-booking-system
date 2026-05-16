let currentPlan = 'basic';
 
const plans = {
    basic: {
        name: 'Basic',
        price: '699',
        label: 'Starter membership',
        badgeText: 'Member',
        badgeColor: null,
        bannerText: 'Basic — ₱699 / month',
        classesUsed: '5 / 8 this month',
    },
    premium: {
        name: 'Premium',
        price: '1,499',
        label: 'Full access membership',
        badgeText: '👑 Gold Member',
        badgeColor: 'gold',
        bannerText: 'Premium — ₱1,499 / month',
        classesUsed: 'Unlimited',
    }
};
 
function updatePage() {
    const plan = plans[currentPlan];
 
    document.getElementById('bannerPlan').textContent = plan.bannerText;
 
    if (currentPlan === 'basic') {
        setCurrentBtn('basicBtn', 'upgradeBtn');
    } else {
        setCurrentBtn('premiumBtn', 'downgradeBtn');
    }
 
    document.getElementById('detailClasses').textContent = plan.classesUsed;
    document.getElementById('detailPlan').textContent = plan.name;
}
 
function setCurrentBtn(currentId, actionId) {
    const basicBtn    = document.getElementById('basicBtn');
    const upgradeBtn  = document.getElementById('upgradeBtn');
    const premiumBtn  = document.getElementById('premiumBtn');
    const downgradeBtn = document.getElementById('downgradeBtn');
 

    [basicBtn, upgradeBtn, premiumBtn, downgradeBtn].forEach(b => b.style.display = 'none');
 
    document.getElementById(currentId).style.display = 'block';
    document.getElementById(actionId).style.display  = 'block';
}
 
function openModal(type) {
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('modalTitle');
    const body  = document.getElementById('modalBody');
    const confirmBtn = document.getElementById('modalConfirm');
 
    if (type === 'upgrade') {
        title.textContent = 'Upgrade to Premium?';
        body.textContent  = 'You\'ll get unlimited classes, priority booking, and a free PT session every month. Billed at ₱1,499/month starting next cycle.';
        confirmBtn.textContent = 'Confirm Upgrade';
        confirmBtn.onclick = () => switchPlan('premium', 'Upgraded to Premium!');
    } else {
        title.textContent = 'Switch back to Basic?';
        body.textContent  = 'You\'ll move to 8 classes/month and lose priority booking and PT sessions. Takes effect next billing cycle.';
        confirmBtn.textContent = 'Confirm Downgrade';
        confirmBtn.onclick = () => switchPlan('basic', 'Switched back to Basic.');
    }
 
    modal.classList.add('open');
}
 
function closeModal() {
    document.getElementById('confirmModal').classList.remove('open');
}
 
function switchPlan(plan, message) {
    currentPlan = plan;
    closeModal();
    updatePage();
    showToast(message);
}
 

document.getElementById('confirmModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
 
updatePage();