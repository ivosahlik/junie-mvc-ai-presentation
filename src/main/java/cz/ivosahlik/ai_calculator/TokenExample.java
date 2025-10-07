package cz.ivosahlik.ai_calculator;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingType;

import java.util.List;

public class TokenExample {
    public static void main(String[] args) {
        // 1. Get the encoding for a specific model (GPT-3.5/GPT-4 uses cl100k_base)
        Encoding enc = Encodings.newDefaultEncodingRegistry().getEncoding(EncodingType.CL100K_BASE);

        // 2. Example text
        String text = "Ahoj světe! Programování je zábava.";

        // 3. Encode (text -> tokens)
        List<Integer> tokens = enc.encode(text);

        // Print tokens as IDs
        System.out.println("Token IDs: " + tokens);

        // 4. Decode (tokens -> text)
        String decoded = enc.decode(tokens);
        System.out.println("Decoded back: " + decoded);

        // 5. Show token count
        System.out.println("Number of tokens: " + tokens.size());
    }
}
