from django.shortcuts import render, get_object_or_404, HttpResponseRedirect
from django.contrib import messages
from product.models import Product, Subcategory


def index(request):
    context = {
        'products': Product.objects.filter(on_the_main=True)
    }
    return render(request, 'product/index.html', context)


def subcategory_product(request, id):
    context = {
        'subcategory': get_object_or_404(Subcategory, id=id)
    }
    return render(request, 'product/subcategory-product.html', context)


def product_details(request, id):
    context = {
        'product': get_object_or_404(Product, id=id)
    }
    return render(request, 'product/product-details.html', context)


def add_product_to_session(request, p_id, p_qty):
    request.session.modified = True
    have_id = False
    if 'products' not in request.session:
        request.session['products'] = []
    session_products = request.session.get('products')
    if len(session_products) > 0:
        for session_product in session_products:
            if int(session_product['id']) == int(p_id):
                session_product['qty'] = str(int(session_product['qty']) + int(p_qty))
                have_id = True
    if not have_id:
        request.session['products'].append({'id': p_id, 'qty': p_qty})


# this is not used, js work with data from form
def cart(request):
    if request.method == 'POST':
        next_page = request.POST.get('next', '/')
        p_id = request.POST.get('product_id')
        p_qty = request.POST.get('product_qty')
        add_product_to_session(request, p_id, p_qty)
        return HttpResponseRedirect(next_page)
    elif request.method == 'DELETE':
        next_page = request.POST.get('next', '/')
        p_id = request.DELETE.get('product_id')
        return HttpResponseRedirect(next_page)
    else:
        if request.session.get('products'):
            products_ids = []
            cart_data = []
            session_products = request.session.get('products')
            for product in session_products:
                products_ids.append(product['id'])
            products = Product.objects.filter(
                id__in=products_ids
            )

            for session_product in session_products:
                for product in products:
                    print(product.id)
                    if product.id == int(session_product['id']):
                        cart_data.append({
                            'product': product,
                            'qty': session_product['qty']
                        })
            return render(request, 'product/cart.html',
                          {'cart_data': cart_data})
        else:
            return render(request, 'product/cart.html')
