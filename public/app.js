const alertsGrid = document.getElementById('alerts-grid');
const alertForm = document.getElementById('alert-form');
const systemStatus = document.getElementById('connection-badge');

async function loadAlertHistory(){
    try{
        const response = await fetch('/api/market/history/all');
        const result = await response.json();
        if(!result.success) throw new Error(result.error);

        systemStatus.textContent = `Live: ${result.count} Targets Monitored`;
        systemStatus.className =  'badge testing';
        alertsGrid.innerHTML = '';
        if(result.data.length === 0){
            alertsGrid.innerHTML  = `<p class='status-text'>No active database targets set. Use the form above to create a new alert.</p>`;
            return;
        }

        result.data.forEach(item =>{
            const card = document.createElement('div');
            card.className = 'alert-card';
            card.innerHTML =`<h3>${item.coin} <span>(${item.currency.toUpperCase()})</span></h3>
                <p class="target-display">Target: ${item.targetPrice}</p>
                <p class="status-text animate">Background loop monitoring...</p>
                <button class="btn-delete" onclick="deleteAlertFromServer(${item.id})">Clear Target</button>`;
                alertsGrid.appendChild(card);
        });
    } catch (err){
        console.log(`[FRONTEND FETCH ERROR]: ${err.message}`);
        systemStatus.textContent = 'System Error Connection Failed';
        systemStatus.className = '#f87171';
        systemStatus.style.color = '#f87171';
    }
}

async function deleteAlertFromServer(id){
    try{
        const response = await fetch(`/api/market/alert/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if(result.success){
            loadAlertHistory();
        }
    } catch (err){
        console.log(`[FRONTEND DELETE ERROR]: ${err.message}`);
    }
}

alertForm.addEventListener('submit',  async (e) =>{
    e.preventDefault();
    const coin = document.getElementById('coin').value;
    const targetPrice = document.getElementById('targetPrice').value;
    const currency = document.getElementById('currency').value;

    try{
        const response = await fetch('/api/market/threshold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({coin, targetPrice, currency})
        });
        const result = await response.json();
        if(result.success){
            alertForm.reset();
            loadAlertHistory();
        } else  {
            alert(`Backend Refused: ${result.error}`);
        }
    } catch (err){
        console.log(`[FRONTEND POST ERROR]: ${err.message}`);
    }
});

window.addEventListener('DOMContentLoaded', loadAlertHistory);