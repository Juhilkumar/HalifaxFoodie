import flask
from jose import jwt, jwk
import mysql.connector
from flask import request, jsonify
import json
from flask_cors import CORS, cross_origin

with open("./private_key.json") as file:
    keys = json.loads(file.read())['keys']

print("keys",keys)

app = flask.Flask(__name__)
app.secret_key = 'halifaxFoodie'

def verifyToken(token):
    headers = jwt.get_unverified_headers(token)
    kid = headers['kid']
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]['kid']:
            key_index = i
            break
    if key_index == -1:
        print('Public key not found in jwks.json')
        return False
    public_key = jwk.construct(keys[key_index])
    payload = jwt.decode(token, public_key, algorithms=["RS256"])
    return payload

@app.route('/getAllFoodItems', methods=['GET'])
@cross_origin()
def getFoodItems():
    # customerName = request.json['customerName']
    # authToken = request.headers.get('Authorization')
    # token = str.replace(str(authToken), 'Bearer ', '')
    # decoded_JSON = jwt.decode(token, algorithms=["HS256"])
    # if (customerName == decoded_JSON['user']):
    my_connect = mysql.connector.connect(
        host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
        user="root",
        passwd="Group123",
        database="halifaxfoodie"
    )
    my_cursor = my_connect.cursor(dictionary=True)
    my_cursor.execute("SELECT * FROM foodItems")
    foodItems = my_cursor.fetchall()
    data = {"foodItems": foodItems}
    if foodItems:
        status = 200
        my_cursor.close()
        my_connect.close()
        return jsonify(data), status
    else:
        data = {"message": "No Food Items to display"}
        return jsonify(data), 200
    # else:
    #     return app.response_class(status=401)


@app.route('/getFoodItemsByRestaurant', methods=['POST'])
@cross_origin()
def getFoodItemsByRestaurant():
    restaurantName = request.json['restaurantName']
    restaurantId = request.json['restaurantId']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = verifyToken(token)
    if (decoded_JSON and restaurantId == decoded_JSON['sub']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        my_cursor = my_connect.cursor(dictionary=True)
        my_cursor.execute("SELECT * FROM foodItems where restaurantId=%s", (restaurantId,))
        foodItems = my_cursor.fetchall()
        data = {"foodItems": foodItems}
        if foodItems:
            status = 200
            my_cursor.close()
            my_connect.close()
            return jsonify(data), status
        else:
            data = {"message": "No Food Items to display"}
            return jsonify(data), 200
    else:
        return app.response_class(status=401)


@app.route('/getOrders', methods=['GET'])
def getAllOrders():
    customerName = request.json['customerName']
    customerId = request.json['customerId']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = verifyToken(token)
    if (decoded_JSON and customerId == decoded_JSON['sub']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        my_cursor = my_connect.cursor(dictionary=True)
        my_cursor.execute("SELECT * FROM orders where customerId = %s", (customerId,))
        orders = my_cursor.fetchall()
        data = {"orders": orders}
        if orders:
            status = 200
            my_cursor.close()
            my_connect.close()
            return jsonify(data), status
        else:
            status = 400
            response = app.response_class(status=status)
        return response
    else:
        return app.response_class(status=401)


@app.route('/createOrder', methods=['POST'])
def createOrder():
    data = request.json
    customerId = data['customerId']
    customerName = data['customerName']
    orderTotalCost = data['orderTotalCost']
    foodItems = data['foodItems']
    restaurantName = data['restaurantName']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = verifyToken(token)
    if (decoded_JSON and customerId == decoded_JSON['sub']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        try:
            my_cursor = my_connect.cursor(dictionary=True)
            my_cursor.execute("INSERT INTO orders(customerName,orderTotalCost,restaurantName, customerId) values (%s,%s,%s,%s)",
                              (customerName, orderTotalCost, restaurantName, customerId))
            order_id = my_cursor.lastrowid
            for foodItem in foodItems:
                my_cursor.execute("INSERT INTO order_foodItems(orderId,foodItemId,quantity) values (%s,%s,%s)",
                                  (order_id, foodItem['id'], foodItem['quantity']))

            my_connect.commit()
            my_cursor.close()
            my_connect.close()
            message = "Order has been placed!!"
            response = {"message": message}
            return jsonify(response), 200
        except Exception as e:
            status = 400
            print(e)
            response = app.response_class(status=status)
        return response
    else:
        return app.response_class(status=401)


@app.route('/giveFeedback', methods=['POST'])
def giveFeedback():
    data = request.json
    customerName = data['customerName']
    foodItemId = data['foodItemId']
    restaurantName = data['restaurantName']
    orderId = data['orderId']
    review = data['review']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = jwt.decode(token, algorithms=["HS256"])
    if (customerName == decoded_JSON['user']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        try:
            my_cursor = my_connect.cursor(dictionary=True)
            my_cursor.execute("select * from orders o join order_foodItems ofi where o.id=ofi.orderId and "
                              "ofi.foodItemId=%s and o.customerName=%s and o.id=%s",
                              (foodItemId, customerName, orderId))
            result = my_cursor.fetchall()
            if (len(result) == 1):
                my_cursor.execute(
                    "INSERT INTO customerReview(user,fooditemid,restaurantname,review) values (%s,%s,%s,%s)",
                    (customerName, foodItemId, restaurantName, review))
                my_connect.commit()
                message = "Review submitted succesfully!"
                response = {"message": message}
                my_cursor.close()
                my_connect.close()
                return jsonify(response), 200
            else:
                status = 400
                message = "Doesnt look like you ordered this food item."
                response = {"message": message}
                my_cursor.close()
                my_connect.close()
                return jsonify(response), status

        except Exception as e:
            status = 400
            print(e)
            response = app.response_class(status=status)
        return response
    else:
        return app.response_class(status=401)


@app.route('/getFeedbackByCustomerName', methods=['GET'])
def getFeedback():
    data = request.json
    customerName = data['customerName']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = jwt.decode(token, algorithms=["HS256"])
    if (customerName == decoded_JSON['user']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        try:
            my_cursor = my_connect.cursor(dictionary=True)
            my_cursor.execute("select * from customerReview where user=%s", (customerName,))
            result = my_cursor.fetchall()
            message = "Reviews restrived succesfully!"
            response = {"message": message, "reviews": result}
            my_cursor.close()
            my_connect.close()
            return jsonify(response), 200
        except Exception as e:
            status = 400
            print(e)
            response = app.response_class(status=status)
        return response
    else:
        return app.response_class(status=401)


@app.route('/getFeedbackByRestaurantName', methods=['GET'])
def getFeedbackByRestaurantName():
    data = request.json
    restaurantName = data['restaurantName']
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = jwt.decode(token, algorithms=["HS256"])
    if (restaurantName == decoded_JSON['user']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        try:
            my_cursor = my_connect.cursor(dictionary=True)
            my_cursor.execute("select * from customerReview where restaurantname=%s", (restaurantName,))
            result = my_cursor.fetchall()
            message = "Reviews restrived succesfully!"
            response = {"message": message, "reviews": result}
            my_cursor.close()
            my_connect.close()
            return jsonify(response), 200
        except Exception as e:
            status = 400
            print(e)
            response = app.response_class(status=status)
        return response
    else:
        return app.response_class(status=401)


@app.route('/changeOrderStatus', methods=['PUT'])
def changeOrderStatus():
    data = request.json
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    decoded_JSON = jwt.decode(token, algorithms=["HS256"])
    orderId = data['id']
    currentStatus = data['currentStatus']
    restaurantName = data['restaurantName']
    if (restaurantName == decoded_JSON['user']):
        my_connect = mysql.connector.connect(
            host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
            user="root",
            passwd="Group123",
            database="halifaxfoodie"
        )
        try:
            statusToChange = ""
            my_cursor = my_connect.cursor(dictionary=True)
            if (currentStatus == "New"):
                statusToChange = "Preparing"
            elif (currentStatus == "Preparing"):
                statusToChange = "Dispatched"
            elif (currentStatus == "Dispatched"):
                statusToChange = "Delivered"
            my_cursor.execute("UPDATE orders set orderStatus=%s where id=%s", (statusToChange, orderId,))
            my_connect.commit()
            message = "Status updated succesfully!"
            response = {"message": message}
            my_cursor.close()
            my_connect.close()
            return jsonify(response), 200
        except Exception as e:
            status = 400
            print(e)
            response = app.response_class(status=status)
        return response
    else:
        status = 401
        return app.response_class(status=status)

@app.route("/createFoodItem", methods=["POST"])
@cross_origin()
def createFoodItem():
    data = request.json
    authToken = request.headers.get('Authorization')
    token = str.replace(str(authToken), 'Bearer ', '')
    response = jsonify(message="Simple server is running")
    response.headers.add("Access-Control-Allow-Origin", "*")
    decodeData = verifyToken(token)
    if decodeData:
        foodItemName = data["foodItemName"]
        restaurantName = data["restaurantName"]
        cost = data["cost"]
        restaurantId = data["restaurantId"]
        if (restaurantId == decodeData['sub']):
            my_connect = mysql.connector.connect(
                host="halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com",
                user="root",
                passwd="Group123",
                database="halifaxfoodie"
            )
            try:
                my_cursor = my_connect.cursor(dictionary=True)
                my_cursor.execute("INSERT INTO foodItems(foodItemName,restaurantName,cost,restaurantId) values (%s,%s,%s,%s)", (foodItemName, restaurantName, cost, restaurantId))
                my_connect.commit()
                message = "Food Items has been added successfully"
                response = {"message": message}
                my_cursor.close()
                my_connect.close()
                return jsonify(response), 200
            except Exception as e:
                status = 400
                print(e)
                response = app.response_class(status=status)
            return response
    else:
        status = 401
        return app.response_class(status=status)



app.run(host="0.0.0.0", port=8080)
