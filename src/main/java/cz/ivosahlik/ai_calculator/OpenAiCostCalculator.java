package cz.ivosahlik.ai_calculator;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingType;

import java.util.List;

public class OpenAiCostCalculator {
    public static void main(String[] args) {
        // 1. Pick encoding for GPT-4o / GPT-3.5 (most use CL100K_BASE)
        Encoding enc = Encodings.newDefaultEncodingRegistry().getEncoding(EncodingType.CL100K_BASE);

        // 2. Example prompt
        String prompt = "Explain how tokenization works in Natural Language Processing.";

        // 3. Encode into tokens
        List<Integer> tokens = enc.encode(prompt);
        int tokenCount = tokens.size();

        // 4. Example: GPT-4o pricing (Sept 2025 – adjust if needed)
        double inputPricePer1k = 0.005;   // $0.005 per 1K input tokens
        double outputPricePer1k = 0.015;  // $0.015 per 1K output tokens

        // For simplicity, assume expected output = 100 tokens
        int expectedOutputTokens = 100;

        // 5. Calculate costs
        double inputCost = (tokenCount / 1000.0) * inputPricePer1k;
        double outputCost = (expectedOutputTokens / 1000.0) * outputPricePer1k;
        double totalCost = inputCost + outputCost;

        // 6. Print results
        System.out.println("Prompt: " + prompt);
        System.out.println("Input tokens: " + tokenCount);
        System.out.println("Estimated output tokens: " + expectedOutputTokens);
        System.out.printf("Input cost: $%.5f%n", inputCost);
        System.out.printf("Output cost: $%.5f%n", outputCost);
        System.out.printf("Total estimated cost: $%.5f%n", totalCost);
    }
}
