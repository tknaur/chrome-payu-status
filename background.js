const RSS_URL = 'https://status.secure.payu.com/history.rss';
const STORAGE_KEY = 'payu_statuspage_last_item_guid';

async function fetchRSS() {
    const lastItemGuid = await getValue(STORAGE_KEY);

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

        const rssContent = await response.text();
        const firstItemGuid = extractFirstItemGuid(rssContent);

        if (!firstItemGuid) {
            console.warn('Could not extract first item GUID from RSS');
            return;
        }

        if (firstItemGuid !== lastItemGuid) {
            await updateBadge();
            await storeValue(STORAGE_KEY, firstItemGuid);
            console.log('New incident detected:', firstItemGuid);
        }
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
    }
}

function extractFirstItemGuid(rssContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssContent, 'application/xml');
    
    if (xmlDoc.parseError) {
        console.error('Failed to parse RSS:', xmlDoc.parseError);
        return null;
    }

    const firstItem = xmlDoc.querySelector('channel > item');
    if (!firstItem) {
        console.warn('No items found in RSS feed');
        return null;
    }

    const guidElement = firstItem.querySelector('guid');
    return guidElement ? guidElement.textContent.trim() : null;
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


chrome.alarms.create("keepAlive", { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "keepAlive") {
		console.log("Keeping the background script alive");
		fetchRSS();
	}
});
