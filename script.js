// Simple data for demonstration
const servicesOffered = [
	{ title: "Web Development", description: "Build modern and responsive websites." },
	{ title: "Graphic Design", description: "Create stunning graphics and logos." },
	{ title: "SEO Optimization", description: "Improve your website's search engine ranking." }
];

const ownServices = [
	{ title: "Custom Consulting", description: "Personalized business advice and strategy." },
	{ title: "Portfolio Review", description: "Get feedback on your work and improve." }
];

const servicesBtn = document.getElementById('servicesBtn');
const ownServicesBtn = document.getElementById('ownServicesBtn');
const viewContent = document.getElementById('viewContent');

function renderServices(services) {
	viewContent.innerHTML = `<div class="services-list">${services.map(s => `
		<div class="service-card">
			<h3>${s.title}</h3>
			<p>${s.description}</p>
		</div>
	`).join('')}</div>`;
}

servicesBtn.addEventListener('click', () => {
	servicesBtn.classList.add('active');
	ownServicesBtn.classList.remove('active');
	renderServices(servicesOffered);
});

ownServicesBtn.addEventListener('click', () => {
	ownServicesBtn.classList.add('active');
	servicesBtn.classList.remove('active');
	renderServices(ownServices);
});

// Initial view
renderServices(servicesOffered);
servicesBtn.classList.add('active');
