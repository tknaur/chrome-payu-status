const RSS_URL = 'https://status.secure.payu.com/history.rss';

async function fetchRSS() {
	try {
		const response = await fetch(RSS_URL);
		const text = await response.text();
		const parser = new DOMParser();
		const xml = parser.parseFromString(text, "application/xml");
		displayFeed(xml);
	} catch (error) {
		console.error('Error fetching RSS feed:', error);
	}
}

function displayFeed(xml) {
	const items = xml.querySelectorAll("item");
	const feedList = document.getElementById("feed");
	feedList.innerHTML = '';


	for (let i = 0; i < items.length; i++) {
		const title = items[i].querySelector("title").textContent;
		const link = items[i].querySelector("link").textContent;
		const createdAt = formatDate(new Date(items[i].querySelector("pubDate").textContent));
		const listItem = document.createElement("li");
		listItem.innerHTML = `<a href="${link}" target="_blank">${title}</a><br><span>${createdAt}</span>`;
		feedList.appendChild(listItem);
		if (i === 5) {
			break;
		}
	};

}

function formatDate(date) {
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	return new Intl.DateTimeFormat('pl-PL', options).format(date);
}

document.addEventListener('DOMContentLoaded', fetchRSS);
chrome.action.setBadgeText({ text: '' });
