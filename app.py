#-*- coding: utf-8 -*-
from flask import Flask
from flask import render_template
from flask.ext.redis import Redis
from flask.ext.restful import reqparse, Api, Resource

app = Flask(__name__)
app.config.from_pyfile('settings.py')
app.config.from_pyfile('local_settings.py', silent=True)

api = Api(app, prefix="/api")
db = Redis(app)

parser = reqparse.RequestParser()
parser.add_argument('title', type=unicode)
parser.add_argument('content', type=unicode)


@app.route('/')
def index():
    return render_template('index.html')


class TextList(Resource):
    def get(self):
        result = {}
        files = []
        keys = db.keys('relax:doc:*')
        for key in keys:
            slug = key.replace('relax:doc:', '')
            title = db.get('relax:title:%s' % slug)
            files.append({
                'title': title,
                'slug': slug
            })
        result['files'] = files
        return result


class TextDetail(Resource):
    def get(self, slug):
        result = {'slug': slug}
        keys = db.keys('relax:*:%s' % slug)
        for key in keys:
            if key.startswith('relax:title:'):
                result['title'] = db.get(key)
            elif key.startswith('relax:doc:'):
                result['content'] = db.get(key)
        return result

    def post(self, slug):
        args = parser.parse_args()
        db.set('relax:doc:%s' % slug, args['content'])
        db.set('relax:title:%s' % slug, args['title'])
        return self.get(slug), 201

    def delete(self, slug):
        db.delete('relax:doc:%s' % slug)
        db.delete('relax:title:%s' % slug)


class Sync(Resource):
    def get(self):
        db.save()
        return {"status": "Sync done"}

api.add_resource(TextList, '/')
api.add_resource(TextDetail, '/file/<slug>')
api.add_resource(Sync, '/sync/')

if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'])
