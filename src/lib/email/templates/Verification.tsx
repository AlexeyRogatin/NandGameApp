export default function Verification({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}) {
  return (
    <>
      <h2>Compute the world</h2>
      <p>
        You were registering with our service. To finish the registration folow
        this link:
        <br />
        <a href={`http://${baseUrl}/registrationComplete/${token}/`}>
          {baseUrl}/registrationComplete/{token}/
        </a>
        <br />
        If it wasn{"'"}t you, then ignore this email.
      </p>
      <p>
        <i>With respect,</i>
      </p>
      <p>
        <i>Compute the word team</i>
      </p>
    </>
  );
}
