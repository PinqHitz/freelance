
// Demo data: categories with optional subcategories and listings
const categories = [
	{
		name: "Web Development",
		subcategories: [
			{
				name: "Frontend",
				listings: [
				]
			},
			{
				name: "Backend",
				listings: [
				]
			}
		]
	},
	{
		name: "Graphic Design",
		subcategories: [
			{
				name: "Logo Design",
				listings: [
				]
			},
			{
				name: "Illustration",
				listings: [
				]
			}
		]
	},
	{
		name: "SEO Optimization",
		listings: [
		]
	}
];

// User's own services
let myServices = [];

const servicesBtn = document.getElementById('servicesBtn');
const ownServicesBtn = document.getElementById('ownServicesBtn');
const viewContent = document.getElementById('viewContent');

// Render main category blocks
function renderCategoryBlocks() {
	viewContent.innerHTML = `<div class="category-blocks">
		${categories.map((cat, idx) => `
			<div class="category-card" data-idx="${idx}">
				<h2>${cat.name}</h2>
			</div>
		`).join('')}
	</div>`;

	// Add click listeners to category cards
	document.querySelectorAll('.category-card').forEach(card => {
		card.addEventListener('click', function() {
			const idx = this.getAttribute('data-idx');
			renderCategoryDetails(categories[idx]);
		});
	});
}

// Render listings for a category (and subcategories if present)
function renderCategoryDetails(category) {
	let html = `<button class="back-btn">← Back to Categories</button>`;
	html += `<h2>${category.name}</h2>`;
	if (category.subcategories) {
		html += `<div class="subcategory-blocks">
			${category.subcategories.map((sub, subIdx) => `
				<div class="subcategory-card" data-subidx="${subIdx}">
					<h3>${sub.name}</h3>
				</div>
			`).join('')}
		</div>`;
		html += `<div class="subcategory-listings"></div>`;
	} else if (category.listings) {
		html += `<div class="services-list">
			${category.listings.map(listing => `
				<div class="service-card">
					<h3>${listing.title}</h3>
					<p>${listing.description}</p>
					<span class="service-person">Offered by: ${listing.name}</span>
				</div>
			`).join('')}
		</div>`;
	}
	viewContent.innerHTML = html;

	// Back button
	document.querySelector('.back-btn').addEventListener('click', renderCategoryBlocks);

	// Subcategory click
	if (category.subcategories) {
		document.querySelectorAll('.subcategory-card').forEach(card => {
			card.addEventListener('click', function() {
				const subIdx = this.getAttribute('data-subidx');
				renderSubcategoryListings(category, category.subcategories[subIdx]);
			});
		});
	}
}

function renderSubcategoryListings(category, subcategory) {
	let html = `<button class="back-btn">← Back to ${category.name}</button>`;
	html += `<h3>${subcategory.name}</h3>`;
	html += `<div class="services-list">
		${subcategory.listings.map(listing => `
			<div class="service-card">
				<h3>${listing.title}</h3>
				<p>${listing.description}</p>
				<span class="service-person">Offered by: ${listing.name}</span>
			</div>
		`).join('')}
	</div>`;
	viewContent.innerHTML = html;
	document.querySelector('.back-btn').addEventListener('click', () => renderCategoryDetails(category));
}


function renderMyServices() {
	// Build category/subcategory dropdown
	let categoryOptions = '';
	categories.forEach((cat, catIdx) => {
		if (cat.subcategories) {
			cat.subcategories.forEach((sub, subIdx) => {
				categoryOptions += `<option value="${catIdx}|${subIdx}">${cat.name} > ${sub.name}</option>`;
			});
		} else {
			categoryOptions += `<option value="${catIdx}">${cat.name}</option>`;
		}
	});

	viewContent.innerHTML = `
		<div class="my-services-tools">
			<h2>Post a New Service</h2>
			<form id="serviceForm">
				<input type="text" id="myName" placeholder="Your Name" required />
				<input type="text" id="myTitle" placeholder="Service Title" required />
				<textarea id="myDescription" placeholder="Service Description" required></textarea>
				<input type="number" id="myPrice" placeholder="Price" min="0" step="any" required />
				<select id="myCategory" required>
					<option value="" disabled selected>Select Category & Subcategory</option>
					${categoryOptions}
				</select>
				<button type="submit">Add Service</button>
			</form>
			<h2>Your Listings</h2>
			<div class="services-list">
				${myServices.length === 0 ? '<p>No listings yet.</p>' : myServices.map(s => `
					<div class="service-card">
						<h3>${s.title}</h3>
						<p>${s.description}</p>
						<p>Price: $${s.price}</p>
						<span class="service-person">${s.categoryLabel} | By: ${s.name}</span>
					</div>
				`).join('')}
			</div>
		</div>
	`;

	// Add form event listener
	const form = document.getElementById('serviceForm');
	if (form) {
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			const name = document.getElementById('myName').value.trim();
			const title = document.getElementById('myTitle').value.trim();
			const description = document.getElementById('myDescription').value.trim();
			const price = document.getElementById('myPrice').value.trim();
			const catValue = document.getElementById('myCategory').value;
			let categoryLabel = '';
			let listing = { name, title, description, price };
			if (catValue.includes('|')) {
				const [catIdx, subIdx] = catValue.split('|');
				categoryLabel = categories[catIdx].name + ' > ' + categories[catIdx].subcategories[subIdx].name;
				// Add to subcategory listings
				categories[catIdx].subcategories[subIdx].listings.push(listing);
			} else if (catValue !== '') {
				categoryLabel = categories[catValue].name;
				// Add to category listings
				categories[catValue].listings = categories[catValue].listings || [];
				categories[catValue].listings.push(listing);
			}
			if (name && title && description && price && categoryLabel) {
				myServices.push({ ...listing, categoryLabel });
				renderMyServices();
			}
		});
	}
}

servicesBtn.addEventListener('click', () => {
	servicesBtn.classList.add('active');
	ownServicesBtn.classList.remove('active');
	renderCategoryBlocks();
});

ownServicesBtn.addEventListener('click', () => {
	ownServicesBtn.classList.add('active');
	servicesBtn.classList.remove('active');
	renderMyServices();
});


// Admin view logic
function renderAdminView() {
	let html = `<div class="admin-view">
		<h2>Admin Panel</h2>
		<div class="admin-categories">
			<h3>Categories & Subcategories</h3>
			<ul>
				${categories.map((cat, catIdx) => `
					<li>
						<strong>${cat.name}</strong>
						<button class="edit-cat" data-idx="${catIdx}">Edit</button>
						<button class="delete-cat" data-idx="${catIdx}">Delete</button>
						${cat.subcategories ? `<ul>
							${cat.subcategories.map((sub, subIdx) => `
								<li>
									${sub.name}
									<button class="edit-subcat" data-catidx="${catIdx}" data-subidx="${subIdx}">Edit</button>
									<button class="delete-subcat" data-catidx="${catIdx}" data-subidx="${subIdx}">Delete</button>
								</li>
							`).join('')}
						</ul>` : ''}
					</li>
				`).join('')}
			</ul>
		</div>
		<div class="admin-add">
			<h3>Add Category</h3>
			<form id="addCategoryForm">
				<input type="text" id="newCategoryName" placeholder="Category Name" required />
				<button type="submit">Add Category</button>
			</form>
			<h3>Add Subcategory</h3>
			<form id="addSubcategoryForm">
				<select id="parentCategorySelect" required>
					<option value="" disabled selected>Select Category</option>
					${categories.map((cat, idx) => `<option value="${idx}">${cat.name}</option>`).join('')}
				</select>
				<input type="text" id="newSubcategoryName" placeholder="Subcategory Name" required />
				<button type="submit">Add Subcategory</button>
			</form>
		</div>
		<button class="back-btn" style="margin-top:24px;">← Back</button>
	</div>`;
	viewContent.innerHTML = html;

	// Add category
	document.getElementById('addCategoryForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const name = document.getElementById('newCategoryName').value.trim();
		if (name) {
			categories.push({ name, subcategories: [] });
			renderAdminView();
		}
	});

	// Add subcategory
	document.getElementById('addSubcategoryForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const catIdx = document.getElementById('parentCategorySelect').value;
		const name = document.getElementById('newSubcategoryName').value.trim();
		if (catIdx !== '' && name) {
			if (!categories[catIdx].subcategories) categories[catIdx].subcategories = [];
			categories[catIdx].subcategories.push({ name, listings: [] });
			renderAdminView();
		}
	});

	// Delete category
	document.querySelectorAll('.delete-cat').forEach(btn => {
		btn.addEventListener('click', function() {
			const idx = this.getAttribute('data-idx');
			categories.splice(idx, 1);
			renderAdminView();
		});
	});

	// Delete subcategory
	document.querySelectorAll('.delete-subcat').forEach(btn => {
		btn.addEventListener('click', function() {
			const catIdx = this.getAttribute('data-catidx');
			const subIdx = this.getAttribute('data-subidx');
			categories[catIdx].subcategories.splice(subIdx, 1);
			renderAdminView();
		});
	});

	// Edit category
	document.querySelectorAll('.edit-cat').forEach(btn => {
		btn.addEventListener('click', function() {
			const idx = this.getAttribute('data-idx');
			const newName = prompt('Edit category name:', categories[idx].name);
			if (newName) {
				categories[idx].name = newName;
				renderAdminView();
			}
		});
	});

	// Edit subcategory
	document.querySelectorAll('.edit-subcat').forEach(btn => {
		btn.addEventListener('click', function() {
			const catIdx = this.getAttribute('data-catidx');
			const subIdx = this.getAttribute('data-subidx');
			const newName = prompt('Edit subcategory name:', categories[catIdx].subcategories[subIdx].name);
			if (newName) {
				categories[catIdx].subcategories[subIdx].name = newName;
				renderAdminView();
			}
		});
	});

	// Back button
	document.querySelector('.back-btn').addEventListener('click', () => {
		renderCategoryBlocks();
		servicesBtn.classList.add('active');
		ownServicesBtn.classList.remove('active');
	});
}

// Admin button event
const adminViewBtn = document.getElementById('adminViewBtn');
if (adminViewBtn) {
	adminViewBtn.addEventListener('click', function() {
		servicesBtn.classList.remove('active');
		ownServicesBtn.classList.remove('active');
		renderAdminView();
	});
}

// Initial view: category blocks
renderCategoryBlocks();
servicesBtn.classList.add('active');
