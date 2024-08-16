// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         //name: { label: "Name", type: "text" },
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           console.log("Credentials: 11111" + credentials.identifier.email);
//           const user = await User.findOne({ email: credentials.identifier });
//           console.log(user);
//           if (!user) throw new Error("No user found");
//           const isValid = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isValid) return user;
//           else throw new Error("Invalid password");
//         } catch (error: any) {
//           throw new Error("ERROR: "+error);
//         }
//       },
//     }),
//   ],
//   // callbacks: {
//   //   async jwt({ token, user }) {
//   //     if (user) {
//   //       token._id = user._id?.toString();
//   //       token.name = user.name;
//   //     }
//   //     return token;
//   //   },
//   //   async session({ session, token }) {
//   //     if (token) {
//   //       session.user._id = token._id as string;
//   //       session.user.email = token.email as string;
//   //       session.user.name = token.name as string;
//   //     }
//   //     return session;
//   //   },
//   // },
//   // pages: {
//   //   signIn: "/sign-in",
//   // },
//   // session: {
//   //   strategy: "jwt",
//   // },
//   // secret: process.env.NEXTAUTH_SECRET,
// };
