from askomics.libaskomics.Database import Database
from askomics.libaskomics.Params import Params


class Dataset(Params):

    """Dataset

    Attributes
    ----------
    celery_id : string
        celery id
    file_id : int
        database file id
    graph_name : string
        graph name
    id : int
        database dataset id
    name : string
        dataset name
    public : bool
        Public
    """

    def __init__(self, app, session, dataset_info={}):
        """init

        Parameters
        ----------
        app : Flask
            Flask app
        session :
            AskOmics session
        dataset_info : dict, optional
            Dataset info
        """
        Params.__init__(self, app, session)

        self.id = dataset_info["id"] if "id" in dataset_info else None
        self.celery_id = dataset_info["celery_id"] if "celery_id" in dataset_info else None
        self.file_id = dataset_info["file_id"] if "file_id" in dataset_info else None
        self.name = dataset_info["name"] if "name" in dataset_info else None
        self.graph_name = dataset_info["graph_name"] if "graph_name" in dataset_info else None
        self.public = dataset_info["public"] if "public" in dataset_info else False

    def set_info_from_db(self):
        """Set the info in from the database
        """
        database = Database(self.app, self.session)

        query = '''
        SELECT celery_id, file_id, name, graph_name, public
        FROM datasets
        WHERE user_id = ?
        AND id = ?
        '''

        rows = database.execute_sql_query(query, (self.session['user']['id'], self.id))

        self.celery_id = rows[0][0]
        self.file_id = rows[0][1]
        self.name = rows[0][2]
        self.graph_name = rows[0][3]
        self.public = rows[0][4]

    def save_in_db(self):
        """Save the dataset into the database
        """
        database = Database(self.app, self.session)

        query = '''
        INSERT INTO datasets VALUES(
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            "started",
            strftime('%s', 'now'),
            NULL,
            ?,
            NULL
        )
        '''

        self.id = database.execute_sql_query(query, (
            self.session["user"]["id"],
            self.celery_id,
            self.file_id,
            self.name,
            self.graph_name,
            self.public,
            0
        ), get_id=True)

    def update_in_db(self, error=False, error_message=None):
        """Update the dataset when integration is done

        Parameters
        ----------
        error : bool, optional
            True if error during integration
        error_message : None, optional
            Error string if error is True
        """
        status = "failure" if error else "success"
        message = error_message if error else ""

        database = Database(self.app, self.session)

        query = '''
        UPDATE datasets SET
        status=?,
        end=strftime('%s', 'now'),
        ntriples=?,
        error_message=?
        WHERE user_id = ? AND id=?
        '''

        database.execute_sql_query(query, (status, 0, message, self.session['user']['id'], self.id))

    def delete_from_db(self):
        """Delete a dataset from the database
        """
        database = Database(self.app, self.session)

        query = '''
        DELETE FROM datasets
        WHERE user_id = ?
        AND id = ?
        '''

        database.execute_sql_query(query, (self.session['user']['id'], self.id))
