const RSS_URL = 'https://status.secure.payu.com/history.rss';
const STORAGE_KEY_MI = 'payu_statuspage_max_items';

async function fetchRSS() {
	try {
		const response = await fetch(RSS_URL);
		const text = await response.text();
		const parser = new DOMParser();
		const xml = parser.parseFromString(text, "application/xml");
		await displayFeed(xml);
	} catch (error) {
		console.error('Error fetching RSS feed:', error);
	}
}

async function displayFeed(xml) {
	const items = xml.querySelectorAll("item");
	const feedList = document.getElementById("feed");
	feedList.innerHTML = '';
	const maxItems = await getValue(STORAGE_KEY_MI) || 5;


	for (let i = 0; i < items.length; i++) {
		const title = items[i].querySelector("title").textContent;
		const link = items[i].querySelector("link").textContent;
		const pubDate = new Date(items[i].querySelector("pubDate").textContent);
		const createdAt = formatDate(pubDate);
		const listItem = document.createElement("li");
		const today = new Date();
		

		if (pubDate.getDate() === today.getDate() 
			&& pubDate.getMonth() === today.getMonth() 
			&& pubDate.getFullYear() === today.getFullYear()) {
			listItem.classList.add("today-entry");
		}

		listItem.innerHTML = `<a href="${link}" target="_blank">${title}</a><br><span>${createdAt}</span>`;
		feedList.appendChild(listItem);
		console.log(`Max items ${maxItems})`);
		if (i === maxItems - 1) {
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

async function getValue(key) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get([key], function (result) {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(result[key]);
			}
		});
	})};

document.addEventListener('DOMContentLoaded', fetchRSS);
chrome.action.setBadgeText({ text: '' });
