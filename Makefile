dos2unix:
	dos2unix run_test.sh

build:
	docker build -t pup .

run:
	docker run -i -t pup
