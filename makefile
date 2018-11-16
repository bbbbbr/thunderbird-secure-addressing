thundermoderate.xpi:
	rm -f build/secure-addressing.xpi
	zip -r build/secure-addressing.xpi chrome components license skin install.rdf chrome.manifest	

clean:
	rm -f build/secure-addressing.xpi
