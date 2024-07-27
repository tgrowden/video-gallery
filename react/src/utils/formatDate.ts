export default function formatDate(input: string | Date) {
  let d: Date;

  if (typeof input === "string") {
    d = new Date(input);
  } else {
    d = input;
  }

  return new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(d);
}
