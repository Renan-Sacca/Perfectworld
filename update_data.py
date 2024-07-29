import requests
from datetime import datetime
from app import app
from database import db
from models import Item, ItemHistory

def fetch_data(item_id, date, server):
    url = "https://api.triviapw.com.br/cotacao/item/"
    payload = f'id={item_id}&date={date}&server={server}'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=4a6f90aa3fc26e05e1e99d0dff387da1'
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()

def update_history(item_id, date, server):
    data = fetch_data(item_id, date, server)
    if data:
        new_history = ItemHistory(
            id=item_id,
            atualizado=data['atualizado'],
            venda=data['venda'],
            compra=data['compra']
        )
        db.session.add(new_history)
        db.session.commit()
        print(f"Data for item {item_id} updated successfully.")

def update_all_items():
    items = Item.query.all()
    date = datetime.now().strftime('%Y-%m-%d')
    server = 'Cassiopeia'
    for item in items:
        update_history(item.id, date, server)

if __name__ == '__main__':
    with app.app_context():
        update_all_items()
