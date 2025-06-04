from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

vision_items = []

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', items=vision_items)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    caption = request.form.get('caption', '')

    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        vision_items.append({
            'filename': filename,
            'caption': caption
        })

    return redirect(url_for('index'))

@app.route('/delete/<filename>', methods=['POST'])
def delete(filename):
    global vision_items
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    vision_items = [item for item in vision_items if item['filename'] != filename]

    return redirect(url_for('index'))

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
