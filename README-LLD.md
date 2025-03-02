# Low-Level Design (LLD) for the Image Processing System

The system allows users to upload CSV file containing image URLs, compresses the images asynchronously (reduces quality by 50%),stores the processed images and provides a status endpoint for checking the processing status.

## System Architecture Diagram

![System Architecture](https://github.com/tejassavaliya44/image-processor/blob/main/architecture.jpg)

## System Components and Their Roles

1. **API Gateway**

- **Role**: The main entry point for all incoming requests. It routes requests for uploading CSV files, checking processing status, and triggering webhooks.

2. **Upload API**

- **Role**: Handles the CSV file uploaded by the user, initiates the image processing tasks in the background by triggering a Child Process, and responds with a unique request ID.

- **Key Functions**:
  - Validates the CSV format and data.
  - Converts CSV data to JSON.
  - Generates a unique request ID and stores it in the Database.
  - Initiates the child process for image compression and storage in background.

3. **Image Processing Engine (Child Process)**

- **Role**: Handles the asynchronous downloading and processing of images (compression) allowing the main application to remain responsive.

- **Key Functions**:
  - Forks a new process to perform image downloading and compression without blocking the main thread.
  - Downloads images from the provided URLs.
  - Compresses each image by 50% of its original quality.
  - Stores the processed images in the designated location (local public directory).
  - Updates the Database with the status of image processing.

4. **Database**

- **Role**: Stores every information from uploaded CSV file in request, product and product image collections including status for the each requests.

- **Key Functions**:
  - Stores the Request ID, product names, image URLs, processing status, and paths to the processed images.
  - Provides data for querying the Status API.

5. **Webhook Handler (Bonus)**

- **Role**: Sends notifications to a user-configured webhook URL once the image processing is completed.

- **Key Functions**:
  - Triggers a POST request to the user-configured webhook endpoint when image processing is finished.
