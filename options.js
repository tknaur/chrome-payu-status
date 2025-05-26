const STORAGE_KEY_MI = 'payu_statuspage_max_items';

document.addEventListener('DOMContentLoaded', () => {
    const maxItemsInput = document.getElementById('maxItems');
    const status = document.getElementById('status');


	chrome.storage.local.get([STORAGE_KEY_MI], function (result) {
		if (chrome.runtime.lastError) {
			console.error('Error retrieving value:', chrome.runtime.lastError);
		} else {
			maxItemsInput.value = result[STORAGE_KEY_MI] || 5;
		}

		console.log('Max items value:', maxItemsInput.value);
	});

    document.getElementById('save').addEventListener('click', () => {
        const value = parseInt(maxItemsInput.value, 10);
        
		// chrome.storage.sync.set({[STORAGE_KEY_MI]: value }, () => {
        //     status.textContent = 'Zapisano!';
        //     setTimeout(() => status.textContent = '', 1500);
		// });

		chrome.storage.local.set({ [STORAGE_KEY_MI]: value }, () => {
			status.textContent = 'Zapisano!';
			setTimeout(() => status.textContent = '', 1500);
		});

		console.log('Max items saved:', value);



		//await chrome.storage.local.set({ [key]: value });

    });
});