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

interface OrgInvitationEmailProps {
  teamName: string;
  invitedByUsername: string;
  invitedByEmail: string;
  inviteLink: string;
}

export default function OrgInvitationEmail({
  teamName,
  invitedByUsername,
  invitedByEmail,
  inviteLink,
}: OrgInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Join {teamName} on SolarFlow</Preview>
      <Tailwind>
        <Body className="bg-slate-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-10 mx-auto p-10 w-116.25 bg-white shadow-2xl">
            <Heading className="text-black text-[28px] font-black p-0 my-7.5 mx-0 text-center tracking-tighter">
              SolarFlow
            </Heading>

            <Text className="text-black text-[14px] leading-6">Hello,</Text>

            <Text className="text-black text-[14px] leading-6">
              <strong>{invitedByUsername}</strong> ({invitedByEmail}) has
              invited you to join the <strong>{teamName}</strong> organization
              on SolarFlow.
            </Text>

            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-[#ff8c42] rounded-xl text-black text-[12px] font-black no-underline text-center px-6 py-4 shadow-lg"
                href={inviteLink}
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-6">
              Or copy and paste this URL into your browser:{" "}
              <span className="text-blue-600 break-all">{inviteLink}</span>
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-8 mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-6">
              If you were not expecting this invitation, you can safely ignore
              this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
