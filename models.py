from database import db
from sqlalchemy import Integer, String, Column, ForeignKey

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)

class ItemHistory(db.Model):
    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id = db.Column(db.Integer, ForeignKey('item.id'), nullable=False)
    atualizado = db.Column(db.String(100), nullable=False)
    venda = db.Column(db.Integer, nullable=False)
    compra = db.Column(db.Integer, nullable=False)
