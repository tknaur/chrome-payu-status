const RSS_URL = 'https://status.secure.payu.com/history.rss';
const STORAGE_KEY = 'payu_statuspage_version';
const HEADER_NAME = 'x-statuspage-version';

async function fetchRSS() {
    const lastHash = await getValue(STORAGE_KEY);

    try {
        const response = await fetch(RSS_URL, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch RSS feed:', response.status);
            return;
        }

        const newContent = await response.text();
        const newHash = await generateHash(newContent);

        if (newHash !== lastHash) {
            await updateBadge();
            await storeValue(STORAGE_KEY, newHash);
        }
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
    }
}

async function generateHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function updateBadge() {
	chrome.action.setBadgeText({ text: '[NEW]' });
	chrome.action.setBadgeBackgroundColor({ color: '#a6c307' });
}


async function storeValue(key, value) {
	console.log('Store new value');

	try {
		await chrome.storage.local.set({ [key]: value });
	} catch (error) {
		// error do nothing
	}
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
	});
}


chrome.alarms.create("keepAlive", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "keepAlive") {
		console.log("Keeping the background script alive");
		fetchRSS();
	}
});
