import { Message, View } from "@aws-amplify/ui-react";

export default function Guess({text} : { text: string }) {
  return (
    <View width="40vw" className="guess-message">
      <Message hasIcon={false} colorTheme="info">{text}</Message>
    </View>
  )
}