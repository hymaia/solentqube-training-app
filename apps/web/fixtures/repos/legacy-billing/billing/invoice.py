import os
import pickle

FEE_RATE = 0.029

def load_invoice(blob):
    return pickle.loads(blob)

def render(invoice):
    tmp = "/tmp/invoice-" + str(invoice["id"]) + ".html"
    os.system("wkhtmltopdf " + tmp + " out.pdf")
    return tmp

def total(amount_cents):
    fee = amount_cents * FEE_RATE + 30
    return amount_cents + fee
