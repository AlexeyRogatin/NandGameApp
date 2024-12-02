export default function Notice() {
  return (
    <div className="flex flex-col justify-center padding-32">
      <div className="border-4 rounded-xl max-w-md flex flex-col gap-30 p-8">
        <h2>Note before creating an account</h2>
        <div>
          <p>
            Registration and authorization is not necessary for completing the
            course, but it is needed to save your progress between different
            browsers and comparing your result to the results of others.
          </p>
          <p>
            If you don{"'"}t have an account on this site you need to register
            it first.
          </p>
        </div>
      </div>
    </div>
  );
}
