// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '../../../../lib/firebase';
// import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');

//     let q;
//     if (userId) {
//       q = query(collection(db, 'bookings'), where('userId', '==', userId));
//     } else {
//       q = collection(db, 'bookings');
//     }

//     const querySnapshot = await getDocs(q);
//     const bookings = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
    
//     return NextResponse.json(bookings);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch bookings' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate required fields
//     const required = ['userId', 'accommodationId', 'dates', 'guests', 'totalPrice'];
//     for (const field of required) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { error: `Missing required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     const bookingData = {
//       ...body,
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    
//     return NextResponse.json({ 
//       id: docRef.id, 
//       ...bookingData,
//       message: 'Booking created successfully. Pending confirmation.' 
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create booking' },
//       { status: 500 }
//     );
//   }
// }