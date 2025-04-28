import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            // Path to your execution trace file
            File file = new File("C:/Users/labde/OneDrive/Desktop/trace.txt");
            InputStream inputStream = new FileInputStream(file);
            
            // Create an instance of AvailabilityTacticParser with the input file
            AvailabilityTacticParser parser = new AvailabilityTacticParser(inputStream);
            
            // Run the parse method
            parser.parse();
            
            // Check if the tactic was found and print the results
            if (parser.tacticFound) {
            	for(int i = 0; i < parser.occurrenceStrings.size(); i++) {
                System.out.println(parser.occurrenceStrings.get(i));
            	}
            } else {
                System.out.println("Tactic Not Found.");
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
