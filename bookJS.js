const API        = "http://localhost:5000/api";
    const USER_EMAIL = "member@gym.com";
    const USER_NAME  = "Sarah Member";
 
    async function loadClasses() {
      try {
        const res      = await fetch(`${API}/classes`);
        const classes  = await res.json();
 
        const bRes     = await fetch(`${API}/bookings/${USER_EMAIL}`);
        const bookings = await bRes.json();
        const bookedIds = bookings.map(b => b.class_id);
 
        renderCards(classes, bookedIds);
        document.querySelector('.class-count').textContent = classes.length + ' classes';
      } catch (err) {
        document.getElementById('classGrid').innerHTML =
          '<p style="color:red;font-size:14px;">Cannot connect to server. Make sure app.py is running.</p>';
      }
    }
 
    function renderCards(classes, bookedIds) {
      const grid = document.getElementById('classGrid');
      grid.innerHTML = '';
 
      classes.forEach(cls => {
        const isFull   = cls.enrolled >= cls.capacity;
        const isBooked = bookedIds.includes(cls.id);
        const categoryLabel = cls.category.charAt(0).toUpperCase() + cls.category.slice(1);
 
        let btnHtml = '';
        if (isBooked) {
          btnHtml = `<button class="book-btn btn-green" disabled>✓ Booked</button>`;
        } else if (isFull) {
          btnHtml = `<button class="book-btn btn-amber" onclick="bookClass('${cls.id}', this)">Join Waitlist</button>`;
        } else {
          btnHtml = `<button class="book-btn btn-blue" onclick="bookClass('${cls.id}', this)">Book Class</button>`;
        }
 
        grid.innerHTML += `
          <div class="class-card" data-category="${cls.category}">
            <div class="card-content">
              <span class="badge badge-${cls.category}">${categoryLabel}</span>
              <p class="class-name">${cls.name}</p>
              <p class="trainer-name">${cls.trainer}</p>
              <p class="class-desc">${cls.desc}</p>
              <div class="info-row"><span class="icon">📅</span> ${cls.days}</div>
              <div class="info-row"><span class="icon">🕐</span> ${cls.time}</div>
              <div class="info-row"><span class="icon">👥</span> ${cls.enrolled}/${cls.capacity} enrolled</div>
              ${btnHtml}
            </div>
          </div>`;
      });
    }
 
    async function bookClass(classId, btn) {
      btn.disabled    = true;
      btn.textContent = 'Booking...';
 
      try {
        const res  = await fetch(`${API}/bookings`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            class_id:   classId,
            user_name:  USER_NAME,
            user_email: USER_EMAIL
          })
        });
 
        const data = await res.json();
 
        if (res.ok) {
          const isWaitlist  = data.status === 'waitlist';
          btn.textContent   = isWaitlist ? '✓ On Waitlist' : '✓ Booked!';
          btn.className     = 'book-btn btn-green';
          showToast(isWaitlist ? 'Added to waitlist!' : 'Class booked successfully!', 'success');
        } else {
          btn.textContent = data.error === 'Already booked' ? '✓ Already Booked' : 'Try Again';
          btn.className   = 'book-btn btn-green';
          showToast(data.error, 'error');
          btn.disabled    = data.error === 'Already booked';
        }
      } catch (err) {
        btn.textContent = 'Error';
        btn.disabled    = false;
        showToast('Cannot connect to server.', 'error');
      }
    }
 
    function filterCards(category, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
 
      const cards = document.querySelectorAll('.class-card');
      let visible = 0;
      cards.forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        card.style.display = match ? 'block' : 'none';
        if (match) visible++;
      });
      document.querySelector('.class-count').textContent = visible + ' classes';
    }
 
    function showToast(msg, type) {
      const toast     = document.getElementById('toast');
      toast.textContent = msg;
      toast.className = 'toast show ' + type;
      setTimeout(() => toast.className = 'toast', 3000);
    }
 
    loadClasses();