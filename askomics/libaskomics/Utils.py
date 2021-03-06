import random


class Utils():

    """Contain utils fonction and classes
    """

    @staticmethod
    def get_random_string(number):
        """return a random string of n character

        Parameters
        ----------
        number : int
            number of character of the random string

        Returns
        -------
        str
            a random string of n chars
        """

        alpabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return ''.join(random.choice(alpabet) for i in range(number))


class cached_property(object):
    """Like @property on a member function, but also cache the calculation in
    self.__dict__[function name].
    The function is called only once since the cache stored as an instance
    attribute override the property residing in the class attributes. Following accesses
    cost no more than standard Python attribute access.
    If the instance attribute is deleted the next access will re-evaluate the function.
    Source: https://blog.ionelmc.ro/2014/11/04/an-interesting-python-descriptor-quirk/

    usage
    -----
    class Shape(object):

        @cached_property
        def area(self):
            # compute value
            return value

    Attributes
    ----------
    func : TYPE
        Description
    """
    __slots__ = ('func')

    def __init__(self, func):

        self.func = func

    def __get__(self, obj, cls):

        value = obj.__dict__[self.func.__name__] = self.func(obj)
        return value
