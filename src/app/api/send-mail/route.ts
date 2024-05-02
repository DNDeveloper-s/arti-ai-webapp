import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ContactFormObject } from "@/constants/contactData";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const reqJSON = await req.json();
    const formValues = reqJSON && (reqJSON.values as ContactFormObject);
    if (!formValues)
      return NextResponse.json({
        status: 400,
        message: "values is required in the request body.",
      });
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.CONTACT_US_TARGET_EMAIL,
      subject: "Thanks for contacting Arti Bot",
      html: `
				<table>
					<tr>
						<td>Full Name: </td>
						<td>${formValues.full_name}</td>
					</tr>
					<tr>
						<td>Email: </td>
						<td>${formValues.email}</td>
					</tr>
					<tr>
						<td>Company: </td>
						<td>${formValues.company}</td>
					</tr>
					<tr>
						<td>Budget: </td>
						<td>${formValues.budget}</td>
					</tr>
					<tr>
						<td>Message: </td>
						<td>${formValues.message}</td>
					</tr>
				</table>
			`,
    };

    const sentMessageInfo = await transporter.sendMail(mailOptions);

    // console.log('sentMessageInfo - ', sentMessageInfo);

    return NextResponse.json({
      ok: true,
      message: "We will get back to you soon.",
    });
  } catch (e: unknown) {
    console.log("Error in sending mail - ", e);
    return NextResponse.json({ ok: false, message: "Please try again later!" });
  }
}
