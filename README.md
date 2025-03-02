# Image Processing System

The system allows users to upload CSV files containing image URLs, processes the images asynchronously (e.g., compressing them), tracks the status of the processing, and triggers a webhook when the processing is completed.

## Technology Stack

- **Node.js** for handling API requests and background processing.
- **Express.js**: Web framework for creating APIs.
- **MongoDB** for storing product data.
- **Axios** for making HTTP requests to download images and trigger webhooks.
- **Sharp** for processing images.

## Getting Started

1. Clone the repository

2. Set Environment Variables (**optional** as project has default values)

   - Make sure to configure the .env file with necessary environment variables as per .env.sample file

3. Start the project

   - npm start

4. Accessing the services:
   - Backend: Running on **http://localhost:3000**
   - MongoDB: Accessible on port **27017**

## Project Structure

1. **`controllers/`**: Contains the logic for addressing incoming processing request, provide status of processing, processing them and provide detailed list of request data after processing the request.

2. **`middlewares/`**: Contains middlewares to effectively handle application errors and validate API requests.

3. **`models/`**: This directory contains mongoose schemas for request, product and product images.

4. **`public/`**: This directory contains publicly accessible assets, such as:
   - `images/` : Stores processed images after they have been compressed.
   - `csv/` : Stores the output CSV files containing the processed image urls along with original csv file records.
   - `index.html` : basic html template to be returned while hitting base endpoint of the app.

5. **`routes/`**: Defines the API routes for image processing and status.

6. **`services/`**: This directory contains the logic to establish connection with mongoDB database.

6. **`utils/`**: Contains app constants and API validations.

7. **`.env`**: The `.env` file contains environment variables required to configure the backend.

8. **`sample.csv`**: Sample csv file to be used for testing purposes.

8. **`README.md`**: This file itself, containing the documentation of the project structure, setup instructions, and usage details.

## API Endpoints

Base EndPoint: **"http://localhost:3000/api"**

1. **/health** - returns API health information

   method: GET

2. **/upload** - initiate image processing request

   method: POST

   **Payload** :

   body: Formdata

   ```
   {
       products: **CSV File**
   }
   ```

   **Succesful Response** :

   ```
   {
       "message": "Processing request has been initiated successfully!",
       "data": {
           "request_id": **RequestID**
       }
   }
   ```

3. **/status/:RequestID** - get request processing status

   method: GET

   **Succesful Response** :

   ```
   {
       "status": "completed" // ['pending','processing','completed','failed']
   }
   ```

4. **/request/:RequestID** - get processed request data

   method: POST

   **Succesful Response** :

   ```
   {
       _id: "",
        ...request fields,
        products: [
            {
                _id: "",
                ...productdata fields,
                product_images: [
                    {
                        _id: "",
                        ...productImage fields
                    }
                ]
            }
        ]
   }
   ```

## Contributing
- Fork the repository and clone it to your local machine.
- Create a new branch for your changes.
- Make your changes and ensure they are working correctly by running tests (if any).
- Submit a pull request with a clear description of the changes you made.