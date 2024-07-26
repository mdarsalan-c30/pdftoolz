
// Function to load HTML content into specified element
function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (elementId === 'header') {
                setupMenuToggle(); // Ensure toggle function is initialized after header is loaded
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Initialize header and footer once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'header');
    loadHTML('footer.html', 'footer');
});

// Setup mobile menu toggle functionality
function setupMenuToggle() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

//Toosl script 
function tooltemplate(){
    document.addEventListener('DOMContentLoaded', () => {
        fetch('tools.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.querySelector('#tools').innerHTML = data;
            })
            .catch(error => console.error('Error fetching tools template:', error));
    });
}
// Function for Image to PDF Conversion
function imageToPDF() {
    document.getElementById('image-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const files = document.getElementById('image-input').files;
        
        if (files.length === 0) {
            alert('Please select images to convert.');
            return;
        }
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = function() {
                    const imgWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (img.height * imgWidth) / img.width;
                    
                    if (i > 0) {
                        pdf.addPage();
                    }
                    
                    pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                    
                    if (i === files.length - 1) {
                        pdf.save('converted.pdf');
                        document.getElementById('output').innerText = 'PDF has been generated!';
                    }
                }
            }
            
            reader.readAsDataURL(file);
        }
    });
}

// Add more functions for other functionalities here

// Function for PDF Splitter
function splitPDF() {
    document.getElementById('split-pdf-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const file = document.getElementById('pdf-input').files[0];
        const splitPage = parseInt(document.getElementById('split-page').value);
        
        if (!file || isNaN(splitPage) || splitPage < 1) {
            alert('Please select a PDF file and enter a valid page number to split.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async function(event) {
            const pdfBytes = event.target.result;
            const pdfLib = PDFLib;
            const pdf = await pdfLib.PDFDocument.load(pdfBytes);
            
            if (splitPage >= pdf.getPageCount()) {
                alert('The page number exceeds the total number of pages in the PDF.');
                return;
            }
            
            const pdf1 = await pdfLib.PDFDocument.create();
            const pdf2 = await pdfLib.PDFDocument.create();
            
            const pages1 = await pdf1.copyPages(pdf, Array.from({ length: splitPage }, (_, i) => i));
            const pages2 = await pdf2.copyPages(pdf, Array.from({ length: pdf.getPageCount() - splitPage }, (_, i) => i + splitPage));
            
            pages1.forEach(page => pdf1.addPage(page));
            pages2.forEach(page => pdf2.addPage(page));
            
            const pdf1Bytes = await pdf1.save();
            const pdf2Bytes = await pdf2.save();
            
            const blob1 = new Blob([pdf1Bytes], { type: 'application/pdf' });
            const blob2 = new Blob([pdf2Bytes], { type: 'application/pdf' });
            
            const url1 = URL.createObjectURL(blob1);
            const url2 = URL.createObjectURL(blob2);
            
            const a1 = document.createElement('a');
            a1.href = url1;
            a1.download = 'split1.pdf';
            document.body.appendChild(a1);
            a1.click();
            document.body.removeChild(a1);
            URL.revokeObjectURL(url1);
            
            const a2 = document.createElement('a');
            a2.href = url2;
            a2.download = 'split2.pdf';
            document.body.appendChild(a2);
            a2.click();
            document.body.removeChild(a2);
            URL.revokeObjectURL(url2);
            
            document.getElementById('output').innerText = 'PDF has been split!';
        }
        reader.readAsArrayBuffer(file);
    });
}

//Function for PDF Merger
function PDFMerger(){
    document.getElementById('merge-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const files = document.getElementById('pdf-input').files;
        if (files.length === 0) {
            alert('Please select PDF files to merge.');
            return;
        }
    
        const pdfLib = PDFLib;
        const mergedPdf = await pdfLib.PDFDocument.create();
    
        for (let file of files) {
            const pdfBytes = await file.arrayBuffer();
            const pdf = await pdfLib.PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => {
                mergedPdf.addPage(page);
            });
        }
    
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.getElementById('output').innerText = 'PDFs have been merged!';
    });
    
}
//MERGE PDF TEMPLATE CODE 
function mergePDF(){
    document.getElementById('merge-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const files = document.getElementById('pdf-input').files;
        if (files.length === 0) {
            alert('Please select PDF files to merge.');
            return;
        }
    
        const pdfLib = PDFLib;
        const mergedPdf = await pdfLib.PDFDocument.create();
    
        for (let file of files) {
            const pdfBytes = await file.arrayBuffer();
            const pdf = await pdfLib.PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => {
                mergedPdf.addPage(page);
            });
        }
    
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.getElementById('output').innerText = 'PDFs have been merged!';
    });
    
}

//WATERMARK PDF 
function watermarkPDF(){
    document.getElementById('watermark-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const file = document.getElementById('pdf-input').files[0];
        const watermarkText = document.getElementById('watermark-text').value;
        
        if (!file || !watermarkText) {
            alert('Please select a PDF file and enter watermark text.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async function(event) {
            const pdfBytes = event.target.result;
            const pdfLib = PDFLib;
            const pdf = await pdfLib.PDFDocument.load(pdfBytes);
            
            const pages = pdf.getPages();
            const { width, height } = pages[0].getSize();
            
            pages.forEach(page => {
                page.drawText(watermarkText, {
                    x: width / 2 - 50,
                    y: height / 2,
                    size: 30,
                    opacity: 0.5,
                    rotate: pdfLib.degrees(-45),
                    color: pdfLib.rgb(0.95, 0.1, 0.1)
                });
            });
            
            const watermarkedPdfBytes = await pdf.save();
            const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'watermarked.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('output').innerText = 'Watermark added to PDF!';
        }
        reader.readAsArrayBuffer(file);
    });
    
}

//PDF TO DOCS
 function PDFtoDOC(){
    document.getElementById('pdf-to-doc-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const file = document.getElementById('pdf-input').files[0];
        if (!file) {
            alert('Please select a PDF file to convert.');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async function(event) {
            const arrayBuffer = event.target.result;
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
    
            let textContent = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                text.items.forEach(item => {
                    textContent += item.str + ' ';
                });
                textContent += '\n\n';
            }
    
            const blob = new Blob([textContent], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('output').innerText = 'PDF has been converted to DOC!';
        }
        reader.readAsArrayBuffer(file);
    });
    
 }

 //DOC to PDF
 function DOCtoPDF(){
    document.getElementById('doc-to-pdf-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const file = document.getElementById('doc-input').files[0];
        if (!file) {
            alert('Please select a DOC file to convert.');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async function(event) {
            const text = event.target.result;
    
            const pdfLib = PDFLib;
            const pdfDoc = await pdfLib.PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
    
            page.drawText(text, {
                x: 50,
                y: height - 50,
                size: 12
            });
    
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('output').innerText = 'DOC has been converted to PDF!';
        }
        reader.readAsText(file);
    });
    
 }
 