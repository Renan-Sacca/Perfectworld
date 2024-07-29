from flask import Flask, jsonify, request
from database import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

from models import Item, ItemHistory

@app.route('/add_item', methods=['POST'])
def add_item():
    data = request.json
    new_item = Item(id=data['id'], nome=data['nome'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Item added successfully"})

@app.route('/update_item', methods=['POST'])
def update_item():
    data = request.json
    item = Item.query.get(data['id'])
    if item:
        new_history = ItemHistory(
            id=data['id'],
            atualizado=data['atualizado'],
            venda=data['venda'],
            compra=data['compra']
        )
        db.session.add(new_history)
        db.session.commit()
        return jsonify({"message": "Item updated successfully"})
    return jsonify({"message": "Item not found"}), 404

@app.route('/get_items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([{"id": item.id, "nome": item.nome} for item in items])

@app.route('/get_item_history/<int:id>', methods=['GET'])
def get_item_history(id):
    histories = ItemHistory.query.filter_by(id=id).all()
    return jsonify([
        {
            "id": history.id,
            "atualizado": history.atualizado,
            "venda": history.venda,
            "compra": history.compra
        } for history in histories
    ])

if __name__ == '__main__':
    app.run()
