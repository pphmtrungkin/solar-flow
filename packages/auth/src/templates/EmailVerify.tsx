import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface EmailVerifyProps {
  email: string;
  url: string;
}

export default function EmailVerify({ email, url }: EmailVerifyProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Heading>Verify your email</Heading>
              <Text>
                Welcome to SolarFlow. We have noticed your signup with this
                email: {email}
              </Text>
              <Button href={url}>Verify</Button>
              <Text>Or, copy and paste this link into your browser: {url}</Text>
              <Text>
                If you didn't create an account, please ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
