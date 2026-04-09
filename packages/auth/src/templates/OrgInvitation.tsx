import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface OrgInvitationEmailProps {
  teamName: string;
  invitedByUsername: string;
  invitedByEmail: string;
  inviteLink: string;
}

export const OrgInvitationEmail = ({
  teamName,
  invitedByUsername,
  invitedByEmail,
  inviteLink,
}: OrgInvitationEmailProps) => {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, `Join ${teamName} on SolarFlow`),
    React.createElement(
      Tailwind,
      null,
      React.createElement(
        Body,
        { className: "bg-slate-50 my-auto mx-auto font-sans" },
        React.createElement(
          Container,
          {
            className:
              "border border-solid border-[#eaeaea] rounded-2xl my-10 mx-auto p-10 w-[465px] bg-white shadow-2xl",
          },
          React.createElement(
            Heading,
            {
              className:
                "text-black text-[28px] font-black p-0 my-7.5 mx-0 text-center tracking-tighter",
            },
            "SolarFlow",
          ),
          React.createElement(
            Text,
            { className: "text-black text-[14px] leading-6" },
            "Hello,",
          ),
          React.createElement(
            Text,
            { className: "text-black text-[14px] leading-6" },
            React.createElement("strong", null, invitedByUsername),
            ` (${invitedByEmail}) has invited you to join the `,
            React.createElement("strong", null, teamName),
            " organization on SolarFlow.",
          ),
          React.createElement(
            Section,
            { className: "text-center mt-8 mb-8" },
            React.createElement(
              Button,
              {
                className:
                  "bg-[#ff8c42] rounded-xl text-black text-[12px] font-black no-underline text-center px-6 py-4 shadow-lg",
                href: inviteLink,
              },
              "Accept Invitation",
            ),
          ),
          React.createElement(
            Text,
            { className: "text-black text-[14px] leading-6" },
            "Or copy and paste this URL into your browser: ",
            React.createElement(
              "span",
              { className: "text-blue-600 break-all" },
              inviteLink,
            ),
          ),
          React.createElement(Hr, {
            className: "border border-solid border-[#eaeaea] my-8 mx-0 w-full",
          }),
          React.createElement(
            Text,
            { className: "text-[#666666] text-[12px] leading-6" },
            "If you were not expecting this invitation, you can safely ignore this email.",
          ),
        ),
      ),
    ),
  );
};
