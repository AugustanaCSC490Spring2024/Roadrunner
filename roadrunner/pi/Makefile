# Variables
PYTHON = python3
SCRIPT = record.py
INSTALL_SCRIPT = install.sh

# Default target
all: setup start_record

# Set executable permissions on install.sh
setup:
	@chmod +x $(INSTALL_SCRIPT)
	@echo "Set executable permissions on $(INSTALL_SCRIPT)."
	@./install.sh

# Start the recording script
start_record:
	@$(PYTHON) $(SCRIPT) $(ARGS)
	@echo "Recording started with arguments: $(ARGS)"

# .PHONY indicates that these targets are not files
.PHONY: all chmod_install start_record
