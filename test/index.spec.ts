import { assert, expect } from 'chai';
import sinon from 'sinon';
import { version } from '../package.json';
import PWSDK from '../src/index';

describe('PWSDK', function () {

  context('when init', function () {
    it('should throw error if invalid arguments', function () {
      expect(() => {
        PWSDK.init();
      }).to.throw(TypeError, 'parentOrigin or instanceId is empty');
    });
  });

  context('when checking environment', function () {
    it('should show log depends on if in iframe or not', function () {
      const isTop = window.top === window;
      const spy = sinon.spy(console, 'log');
      assert(PWSDK.checkEnvironment());
      expect(spy.calledOnce).to.equal(isTop);
      spy.restore();
    });
  });

  context('when checking version', function () {
    it('should be the same as the version from package.json', function () {
      expect(PWSDK.version).to.equal(version);
    });
  });

  context('when create new instance', function () {
    it('should throw if not enough parameter', function () {
      expect(() => {
        // need to cast it to any so typescript won't throw error
        const sdk = new (PWSDK as any)(); // tslint:disable-line
      }).to.throw(TypeError, 'parentOrigin or instanceId is empty');
    });
  });

  context('when using sdk public methods', function () {
    let sdk;
    let win;

    const origin = 'https://prosperworks.com';
    const instanceId = '1';

    beforeEach(function () {
      win = {
        addEventListener: window.addEventListener.bind(window),
        top: {
          postMessage: sinon.stub(),
        },
      };
      sdk = new PWSDK(origin, instanceId, win);
    });

    after(function () {
      sdk = null;
      win = null;
    });

    context('#getContext', function () {
      it('should be able to get context from parent', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(new MessageEvent('message', {
            origin,
            data: {
              type: 'getContext',
              context: {
                id: '1',
                name: 'Alice',
              },
            },
          }));
        });
        const data = await sdk.getContext();
        expect(data.type).to.equal('getContext');
        expect(data.context).to.eql({
          id: '1',
          name: 'Alice',
        });
      });
    });

    context('#setAppUI', function () {
      it('should be able to receive ui settings', function () {
        sdk.setAppUI({ count: 0 });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'setUI',
            instanceId,
            version,
            data: {
              count: 0,
            },
          });
        }));
      });
    });

    context('#showModal', function () {
      it('should be able to show modal', function () {
        sdk.showModal({ name: 'Alice' });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'showModal',
            instanceId,
            version,
            params: {
              name: 'Alice',
            },
          });
        }));
      });
    });

    context('#closeModal', function () {
      it('should be able to close modal', function () {
        sdk.closeModal();
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'closeModal',
            instanceId,
            version,
          });
        }));
      });
    });

    context('#proxyMessage', function () {
      it('should be able to close modal', function () {
        sdk.proxyMessage('target', {
          yo: 42,
        });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'proxyMessage',
            instanceId,
            version,
            target: 'target',
            data: {
              yo: 42,
            },
          });
        }));
      });
    });

    context('#on and #trigger', function () {
      it('should trigger methods and subscribe it correctly', function () {
        const spy1 = sinon.spy();
        sdk.on('myevent1', spy1);
        sdk.trigger('myevent1', { yo: 42 });
        sdk.trigger('myevent1', { yo: 42 });

        assert(spy1.calledTwice);
        assert(spy1.calledWithMatch(sinon.match.has('yo', 42)));
      });

      it('should trigger all callback subscribed to one event', function () {
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        sdk.on('myevent1', spy1);
        sdk.on('myevent1', spy2);
        sdk.trigger('myevent1', { yo: 42 });

        assert(spy1.calledWithMatch(sinon.match.has('yo', 42)));
        assert(spy2.calledWithMatch(sinon.match.has('yo', 42)));
      });
    });

    context('message handler', function () {
      it('should not respond to message from unknown origin', function () {
        const spy = sinon.spy(sdk, 'trigger');
        window.dispatchEvent(new MessageEvent('message', {
          origin: 'https://otherorigin.com',
          data: {
            type: 'myType',
            context: {
              id: '1',
              name: 'Alice',
            },
          },
        }));
        assert(spy.notCalled);
        spy.restore();
      });

      it('should not trigger if message does not have type', function () {
        const spy = sinon.spy(sdk, 'trigger');
        window.dispatchEvent(new MessageEvent('message', {
          origin,
          data: {
            foo: 'bar',
          },
        }));
        assert(spy.notCalled);
        spy.restore();
      });
    });

    context('deferredQueue', function () {
      it('should resolve based on fifo', async function () {
        const contexts = [
          { id: '1', name: 'Alice' },
          { id: '2', name: 'Bob' },
        ];
        let count = 0;
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(new MessageEvent('message', {
            origin,
            data: {
              type: 'getContext',
              context: contexts[count++],
            },
          }));
        });

        expect(sdk.deferredQueues.getContext).to.be.undefined;

        const [data1, data2] = await Promise.all([
          sdk.getContext(),
          sdk.getContext(),
        ]);

        expect(data1.context).to.eql(contexts[0]);
        expect(data2.context).to.eql(contexts[1]);
        expect(sdk.deferredQueues.getContext).to.be.an('array')
          .that.has.length(0);
      });
    });
  });

});
