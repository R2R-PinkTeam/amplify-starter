.PHONY: serve open help

# Default target
help:
	@echo "Pink Team Presentation - Available commands:"
	@echo "  make serve  - Start a local server on port 8080"
	@echo "  make open   - Open the presentation in the default browser"
	@echo "  make help   - Show this help message"

# Serve the presentation locally
serve:
	@echo "Starting server at http://localhost:8080"
	@echo "Press Ctrl+C to stop"
	@python3 -m http.server 8080

# Open the presentation in the browser
open:
	@open pink-team-hackathon.html || xdg-open pink-team-hackathon.html || start pink-team-hackathon.html
