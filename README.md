# QuickCall

QuickCall is a video conferencing application built with Next.js, leveraging MongoDB via Mongoose for data management, video calls powered by Stream through getstream.io, and user authentication through NextAuth.

## Features

- **Real-time Video Conferencing**: Powered by getstream.io, enabling seamless video calls.
- **User Authentication**: Secure and easy authentication using NextAuth v5.
- **Database**: MongoDB is used for storing user data, meeting information, and more, managed via Mongoose.
- **Responsive UI**: Built with modern UI components for a smooth user experience.

## Tech Stack

- **Frontend**: Next.js v14, React, TypeScript
- **Backend**: Next.js API routes
- **Database**: MongoDB, Mongoose
- **Authentication**: NextAuth v5
- **Video Conferencing**: Stream via getstream.io
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- MongoDB instance (local or hosted)
- Stream account for video conferencing
- Environment variables for NextAuth

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/quickcall.git
   cd quickcall
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   #NEXT AUTH CREDENTIALS
   AUTH_SECRET=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   HASH_SALT=

   #STREAM CREDENTIALS
   NEXT_PUBLIC_STREAM_API_KEY=
   STREAM_SECRET=
   STREAM_APP_ID=

   #MONOGO DB CREDENTIALS
   MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.sxwgxwg.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority&appName=Cluster0

   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## Usage

- **Sign Up / Sign In**: Use the authentication options provided to create an account or log in.
- **Create a Meeting**: Set up a new video meeting by providing a meeting name.
- **Join a Meeting**: Enter the meeting ID to join an existing video call.

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are welcome.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or support, please contact Aditya Sharma at [your.email@example.com](mailto:your.email@example.com).
