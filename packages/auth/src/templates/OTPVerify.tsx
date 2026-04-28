import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface OTPVerifyProps {
  email: string;
  otp: string;
  type: string;
}

export default function OTPVerify({ email, otp, type }: OTPVerifyProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Heading>Verify your email address: {email}</Heading>
              <Text>Your OTP is: {otp}</Text>
              <Text>Type: {type}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
